from typing import Optional
from datetime import date, datetime, time
from pydantic import BaseModel, Field, computed_field
from app.models.entities import KategoriPetugasEnum, KondisiEnum, RoleEnum
from app.schemas.common import ORMBase


class UserRead(ORMBase):
    id: int
    username: str
    email: str
    role: RoleEnum
    created_at: datetime


class KeuanganBase(BaseModel):
    user_id: int = 1
    pemasukan: int = Field(default=0, ge=0)
    pengeluaran: int = Field(default=0, ge=0)
    jenis_pengeluaran: str | None = None
    jenis_pemasukan: str | None = None
    tanggal: date


class KeuanganCreate(KeuanganBase):
    pass


class KeuanganUpdate(BaseModel):
    pemasukan: int | None = Field(default=None, ge=0)
    pengeluaran: int | None = Field(default=None, ge=0)
    jenis_pengeluaran: str | None = None
    jenis_pemasukan: str | None = None
    tanggal: date | None = None


class KeuanganRead(ORMBase):
    id: int
    user_id: int
    pemasukan: int
    pengeluaran: int
    jenis_pengeluaran: str | None = None
    jenis_pemasukan: str | None = None
    tanggal: date
    created_at: datetime


class SarprasBase(BaseModel):
    user_id: int = 1
    barang: str = Field(min_length=2, max_length=255)
    kondisi: KondisiEnum


class SarprasCreate(SarprasBase):
    pass


class SarprasUpdate(BaseModel):
    barang: str | None = Field(default=None, min_length=2, max_length=255)
    kondisi: KondisiEnum | None = None


class SarprasRead(ORMBase, SarprasBase):
    id: int


class JadwalBase(BaseModel):
    user_id: int = 1
    imam: str = Field(min_length=2, max_length=255)
    kategori_imam: str
    khatib: str = Field(min_length=2, max_length=255)
    kategori_khatib: str
    muadzin: str = Field(min_length=2, max_length=255)
    kategori_muadzin: str


class JadwalCreate(JadwalBase):
    pass


class JadwalUpdate(BaseModel):
    imam: Optional[str] = Field(default=None, min_length=2, max_length=255)
    kategori_imam: Optional[str] = None
    khatib: Optional[str] = Field(default=None, min_length=2, max_length=255)
    kategori_khatib: Optional[str] = None
    muadzin: Optional[str] = Field(default=None, min_length=2, max_length=255)
    kategori_muadzin: Optional[str] = None


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
