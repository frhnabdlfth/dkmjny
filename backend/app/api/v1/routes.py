import os
import glob
from fastapi.responses import FileResponse
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import get_db
from app.models.entities import User, Backup, JadwalDKM, Keuangan, ProkerDKM, Renovasi, Sarpras, KondisiEnum
from app.services.sarpras import SarprasService
from app.schemas.common import Message
from app.schemas.entities import (
    UserRead,
    UserUpdate,
    BackupRead,
    JadwalCreate,
    JadwalRead,
    JadwalUpdate,
    KeuanganCreate,
    KeuanganRead,
    KeuanganUpdate,
    ProkerCreate,
    ProkerRead,
    ProkerUpdate,
    RenovasiCreate,
    RenovasiRead,
    RenovasiUpdate,
    SarprasCreate,
    SarprasRead,
    SarprasUpdate,
)
from app.schemas.auth import LoginRequest, LoginResponse, AuthUser
from app.services import backup as backup_service
from app.services import crud
from app.services.dashboard import get_dashboard_summary
from app.services.auth import authenticate_user, create_access_token, get_current_user, hash_password
from app.core.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.login_id, payload.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email/username atau password salah",
        )
    token = create_access_token(data={"sub": user.id})
    return LoginResponse(
        access_token=token,
        user=AuthUser.model_validate(user),
    )


@router.get("/auth/me", response_model=AuthUser)
def me(current_user: User = Depends(get_current_user)):
    return AuthUser.model_validate(current_user)


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_dashboard_summary(db)


@router.get("/user/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    return user


@router.put("/user/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User tidak ditemukan"
        )

    username_exist = db.query(User).filter(
        User.username == payload.username,
        User.id != user_id
    ).first()

    if username_exist:
        raise HTTPException(
            status_code=400,
            detail="Username sudah digunakan"
        )

    email_exist = db.query(User).filter(
        User.email == payload.email,
        User.id != user_id
    ).first()

    if email_exist:
        raise HTTPException(
            status_code=400,
            detail="Email sudah digunakan"
        )

    user.username = payload.username
    user.email = payload.email

    if payload.password:
        user.password = hash_password(payload.password)

    db.commit()
    db.refresh(user)

    return user

def register_crud(prefix: str, model, create_schema, update_schema, read_schema):
    @router.get(prefix, response_model=list[read_schema])
    def list_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
        return crud.list_items(db, model, skip, limit)

    @router.get(f"{prefix}/{{item_id}}", response_model=read_schema)
    def detail_endpoint(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
        return crud.get_item(db, model, item_id)

    @router.post(prefix, response_model=read_schema, status_code=201)
    def create_endpoint(payload: create_schema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
        if hasattr(payload, "user_id"):
            payload.user_id = current_user.id
        return crud.create_item(db, model, payload)

    @router.put(f"{prefix}/{{item_id}}", response_model=read_schema)
    def update_endpoint(item_id: int, payload: update_schema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
        item = crud.get_item(db, model, item_id)
        return crud.update_item(db, item, payload)

    @router.delete(f"{prefix}/{{item_id}}", response_model=Message)
    def delete_endpoint(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
        item = crud.get_item(db, model, item_id)
        crud.delete_item(db, item)
        return {"message": "Data berhasil dihapus"}


register_crud("/keuangan", Keuangan, KeuanganCreate, KeuanganUpdate, KeuanganRead)
register_crud("/jadwal-dkm", JadwalDKM, JadwalCreate, JadwalUpdate, JadwalRead)
register_crud("/proker-dkm", ProkerDKM, ProkerCreate, ProkerUpdate, ProkerRead)
register_crud("/renovasi", Renovasi, RenovasiCreate, RenovasiUpdate, RenovasiRead)


@router.get("/keuangan")
def list_keuangan(
    search: str | None = None,
    sort: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.list_items(
        db=db,
        model=Keuangan,
        search=search,
        search_fields=[
            "deskripsi",
            "jenis_pemasukan",
            "jenis_pengeluaran",
        ],
        sort_field="tanggal",
        sort_order=sort,
    )


@router.get("/backup", response_model=list[BackupRead])
def list_backups(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.list_items(db, Backup)


@router.post("/backup", response_model=BackupRead, status_code=201)
def create_backup(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return backup_service.create_backup(db)


@router.delete("/backup/{item_id}", response_model=Message)
def delete_backup(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = crud.get_item(db, Backup, item_id)
    backup_service.delete_backup_file(db, item)
    return {"message": "Backup berhasil dihapus"}
    
import glob
from fastapi.responses import FileResponse


@router.get("/backup/{item_id}/download")
def download_backup(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = crud.get_item(db, Backup, item_id)

    pattern = os.path.join(
        settings.backup_dir,
        f"{item.db}_{item.tanggal.strftime('%Y%m%d')}_*.sql",
    )
    files = glob.glob(pattern)

    if not files:
        raise HTTPException(status_code=404, detail="File backup tidak ditemukan")

    return FileResponse(
        path=sorted(files)[-1],
        filename=os.path.basename(sorted(files)[-1]),
        media_type="application/octet-stream",
    )


@router.get("/sarpras", response_model=list[SarprasRead])
def list_sarpras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return list(db.scalars(select(Sarpras).offset(skip).limit(limit)).all())


@router.post("/sarpras", response_model=SarprasRead)
def create_sarpras(
    user_id: int = Form(1), # Optional, ignored
    barang: str = Form(...),
    kondisi: str = Form(...),
    foto: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        data = SarprasCreate(
            user_id=current_user.id,
            barang=barang,
            kondisi=KondisiEnum(kondisi),
        )
    except Exception as e:
        raise HTTPException(400, f"Invalid kondisi: {kondisi}")

    return SarprasService.create(db, data, foto)


@router.put("/sarpras/{item_id}", response_model=SarprasRead)
def update_sarpras(
    item_id: int,
    barang: str | None = Form(None),
    kondisi: KondisiEnum | None = Form(None),
    foto: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = SarprasUpdate(barang=barang, kondisi=kondisi)
    result = SarprasService.update(db, item_id, data, foto)

    if not result:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    return result


@router.delete("/sarpras/{item_id}", response_model=Message)
def delete_sarpras(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = SarprasService.delete(db, item_id)

    if not result:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    return {"message": "Sarpras berhasil dihapus"}


@router.get("/sarpras/{item_id}", response_model=SarprasRead)
def detail_sarpras(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sarpras = db.query(Sarpras).filter(Sarpras.id == item_id).first()

    if not sarpras:
        raise HTTPException(status_code=404, detail="Not found")

    return SarprasRead.model_validate(sarpras)
