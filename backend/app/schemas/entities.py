from typing import Optional
from datetime import date, datetime, time
from pydantic import BaseModel, Field, field_validator, EmailStr
from app.models.entities import KategoriPetugasEnum, KondisiEnum, RoleEnum
from app.schemas.common import ORMBase


class UserRead(ORMBase):
    id: int
    username: str
    email: str
    role: RoleEnum
    created_at: datetime
    

class UserUpdate(BaseModel):
    username: str
    email: EmailStr
    password: Optional[str] = None


class KeuanganBase(BaseModel):
    user_id: int = 1
    pemasukan: int = Field(default=0, ge=0)
    pengeluaran: int = Field(default=0, ge=0)
    jenis_pengeluaran: str | None = None
    jenis_pemasukan: str | None = None
    tanggal: date
    deskripsi: str | None = None


class KeuanganCreate(KeuanganBase):
    pass


class KeuanganUpdate(BaseModel):
    pemasukan: int | None = Field(default=None, ge=0)
    pengeluaran: int | None = Field(default=None, ge=0)
    jenis_pengeluaran: str | None = None
    jenis_pemasukan: str | None = None
    tanggal: date | None = None
    deskripsi: str | None = None


class KeuanganRead(ORMBase):
    id: int
    user_id: int
    pemasukan: int
    pengeluaran: int
    jenis_pengeluaran: str | None = None
    jenis_pemasukan: str | None = None
    tanggal: date
    deskripsi: str | None = None
    created_at: datetime


class SarprasBase(BaseModel):
    user_id: int = 1
    barang: str = Field(min_length=2, max_length=255)
    kondisi: KondisiEnum
    foto: str | None = None


class SarprasCreate(SarprasBase):
    pass


class SarprasUpdate(BaseModel):
    barang: str | None = Field(default=None, min_length=2, max_length=255)
    kondisi: KondisiEnum | None = None
    foto: str | None = Field(default=None, max_length=255)


class SarprasRead(ORMBase, SarprasBase):
    id: int


class JadwalBase(BaseModel):
    user_id: int = 1
    tanggal: date
    imam: str = Field(min_length=2, max_length=255)
    kategori_imam: str
    khatib: str | None = Field(default=None, min_length=2, max_length=255)
    kategori_khatib: str | None = Field(default=None)
    muadzin: str | None = Field(default=None, min_length=2, max_length=255)
    kategori_muadzin: str | None = Field(default=None)

    @field_validator("khatib", "muadzin", "kategori_khatib", "kategori_muadzin", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v


class JadwalCreate(JadwalBase):
    pass


class JadwalUpdate(BaseModel):
    tanggal: date | None = None
    imam: str | None = Field(default=None, min_length=2, max_length=255)
    kategori_imam: str | None = None
    khatib: str | None = Field(default=None, min_length=2, max_length=255)
    kategori_khatib: str | None = None
    muadzin: str | None = Field(default=None, min_length=2, max_length=255)
    kategori_muadzin: str | None = None

    @field_validator(
        "imam", "khatib", "muadzin",
        "kategori_imam", "kategori_khatib", "kategori_muadzin",
        mode="before",
    )
    @classmethod
    def empty_str_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v


class JadwalRead(ORMBase, JadwalBase):
    id: int


class ProkerBase(BaseModel):
    user_id: int = 1
    kegiatan_dkm: str = Field(min_length=2, max_length=255)
    waktu_kegiatan: time
    tanggal_kegiatan: date


class ProkerCreate(ProkerBase):
    pass


class ProkerUpdate(BaseModel):
    kegiatan_dkm: str | None = None
    waktu_kegiatan: time | None = None
    tanggal_kegiatan: date | None = None


class ProkerRead(ORMBase, ProkerBase):
    id: int


class RenovasiBase(BaseModel):
    user_id: int = 1
    jenis_perbaikan: str = Field(min_length=2, max_length=255)
    tanggal_perbaikan: date
    progress: int = Field(default=0, ge=0, le=100)


class RenovasiCreate(RenovasiBase):
    pass


class RenovasiUpdate(BaseModel):
    jenis_perbaikan: str | None = None
    tanggal_perbaikan: date | None = None
    progress: int | None = Field(default=None, ge=0, le=100)


class RenovasiRead(ORMBase, RenovasiBase):
    id: int


class BackupRead(ORMBase):
    id: int
    db: str
    tanggal: date
