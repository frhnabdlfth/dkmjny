from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Backup, JadwalDKM, Keuangan, ProkerDKM, Renovasi, Sarpras, KondisiEnum
from app.services.sarpras import SarprasService
from app.schemas.common import Message
from app.schemas.entities import (
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
from app.services import backup as backup_service
from app.services import crud
from app.services.dashboard import get_dashboard_summary

router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return get_dashboard_summary(db)


def register_crud(prefix: str, model, create_schema, update_schema, read_schema):
    @router.get(prefix, response_model=list[read_schema])
    def list_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        return crud.list_items(db, model, skip, limit)

    @router.get(f"{prefix}/{{item_id}}", response_model=read_schema)
    def detail_endpoint(item_id: int, db: Session = Depends(get_db)):
        return crud.get_item(db, model, item_id)

    @router.post(prefix, response_model=read_schema, status_code=201)
    def create_endpoint(payload: create_schema, db: Session = Depends(get_db)):
        return crud.create_item(db, model, payload)

    @router.put(f"{prefix}/{{item_id}}", response_model=read_schema)
    def update_endpoint(item_id: int, payload: update_schema, db: Session = Depends(get_db)):
        item = crud.get_item(db, model, item_id)
        return crud.update_item(db, item, payload)

    @router.delete(f"{prefix}/{{item_id}}", response_model=Message)
    def delete_endpoint(item_id: int, db: Session = Depends(get_db)):
        item = crud.get_item(db, model, item_id)
        crud.delete_item(db, item)
        return {"message": "Data berhasil dihapus"}


register_crud("/keuangan", Keuangan, KeuanganCreate, KeuanganUpdate, KeuanganRead)
register_crud("/jadwal-dkm", JadwalDKM, JadwalCreate, JadwalUpdate, JadwalRead)
register_crud("/proker-dkm", ProkerDKM, ProkerCreate, ProkerUpdate, ProkerRead)
register_crud("/renovasi", Renovasi, RenovasiCreate, RenovasiUpdate, RenovasiRead)


@router.get("/backup", response_model=list[BackupRead])
def list_backups(db: Session = Depends(get_db)):
    return crud.list_items(db, Backup)


@router.post("/backup", response_model=BackupRead, status_code=201)
def create_backup(db: Session = Depends(get_db)):
    return backup_service.create_backup(db)


@router.delete("/backup/{item_id}", response_model=Message)
def delete_backup(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db, Backup, item_id)
    backup_service.delete_backup_file(db, item)
    return {"message": "Backup berhasil dihapus"}


@router.get("/sarpras", response_model=list[SarprasRead])
def list_sarpras(db: Session = Depends(get_db)):
    return db.query(Sarpras).all()


@router.post("/sarpras", response_model=SarprasRead)
def create_sarpras(
    user_id: int = Form(...),
    barang: str = Form(...),
    kondisi: str = Form(...),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    try:
        data = SarprasCreate(
            user_id=user_id,
            barang=barang,
            kondisi=KondisiEnum(kondisi),
        )
    except Exception as e:
        raise HTTPException(400, f"Invalid kondisi: {kondisi}")

    return SarprasService.create(db, data, file)

@router.put("/sarpras/{item_id}", response_model=SarprasRead)
def update_sarpras(
    item_id: int,
    barang: str | None = Form(None),
    kondisi: KondisiEnum | None = Form(None),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    print("FILE:", file)
    print("FILE FILENAME:", file.filename if file else None)
    data = SarprasUpdate(barang=barang, kondisi=kondisi)
    result = SarprasService.update(db, item_id, data, file)

    if not result:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    return result

@router.delete("/sarpras/{item_id}", response_model=Message)
def delete_sarpras(
    item_id: int,
    db: Session = Depends(get_db),
):
    result = SarprasService.delete(db, item_id)

    if not result:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    return {"message": "Sarpras berhasil dihapus"}

@router.get("/sarpras/{item_id}", response_model=SarprasRead)
def detail_sarpras(item_id: int, db: Session = Depends(get_db)):
    sarpras = db.query(Sarpras).filter(Sarpras.id == item_id).first()

    if not sarpras:
        raise HTTPException(status_code=404, detail="Not found")

    return SarprasRead.model_validate(sarpras)