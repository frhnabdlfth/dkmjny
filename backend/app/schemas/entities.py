from datetime import date, datetime, time
from pydantic import BaseModel, Field, computed_field
from app.models.entities import JenisPengeluaranEnum, KategoriPetugasEnum, KondisiEnum, RoleEnum
from app.schemas.common import ORMBase


class UserRead(ORMBase):
    id: int
    username: str
    email: str
    role: RoleEnum
    created_at: datetime


class KeuanganBase(BaseModel):
    user_id: int = 1
    saldo_awal: int = Field(default=0, ge=0)
    pemasukan: int = Field(default=0, ge=0)
    pengeluaran: int = Field(default=0, ge=0)
    jenis_pengeluaran: JenisPengeluaranEnum | None = None
    tanggal: date


class KeuanganCreate(KeuanganBase):
    pass


class KeuanganUpdate(BaseModel):
    saldo_awal: int | None = Field(default=None, ge=0)
    pemasukan: int | None = Field(default=None, ge=0)
    pengeluaran: int | None = Field(default=None, ge=0)
    jenis_pengeluaran: JenisPengeluaranEnum | None = None
    tanggal: date | None = None


class KeuanganRead(ORMBase, KeuanganBase):
    id: int
    created_at: datetime

    @computed_field
    @property
    def saldo_akhir(self) -> int:
        return int(self.saldo_awal or 0) + int(self.pemasukan or 0) - int(self.pengeluaran or 0)


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
    kategori_imam: KategoriPetugasEnum
    khatib: str | None = None
    kategori_khatib: KategoriPetugasEnum | None = None
    muadzin: str | None = None
    kategori_muadzin: KategoriPetugasEnum | None = None


class JadwalCreate(JadwalBase):
    pass


class JadwalUpdate(BaseModel):
    imam: str | None = None
    kategori_imam: KategoriPetugasEnum | None = None
    khatib: str | None = None
    kategori_khatib: KategoriPetugasEnum | None = None
    muadzin: str | None = None
    kategori_muadzin: KategoriPetugasEnum | None = None


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
    user_id: int
    db: str
    tanggal: date
