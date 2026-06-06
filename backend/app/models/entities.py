from typing import Optional
from enum import Enum
from sqlalchemy import Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, String, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class RoleEnum(str, Enum):
    Admin = "Admin"
    Ketua = "Ketua"
    Wakil = "Wakil"
    Bendahara = "Bendahara"
    Sekretaris = "Sekretaris"


class KondisiEnum(str, Enum):
    Bagus = "Bagus"
    Rusak = "Rusak"
    PerluDiperbaiki = "Perlu Diperbaiki"


class KategoriPetugasEnum(str, Enum):
    LimaWaktu = "5 Waktu"
    Jumatan = "Jum'atan"
    IdulFitri = "Idul Fitri"
    IdulAdha = "Idul Adha"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(25), nullable=False, unique=True, index=True)
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[RoleEnum] = mapped_column(SqlEnum(RoleEnum), default=RoleEnum.Admin, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    keuangan = relationship("Keuangan", back_populates="user", cascade="all, delete-orphan")
    sarpras = relationship("Sarpras", back_populates="user", cascade="all, delete-orphan")
    jadwal_dkm = relationship("JadwalDKM", back_populates="user", cascade="all, delete-orphan")
    proker_dkm = relationship("ProkerDKM", back_populates="user", cascade="all, delete-orphan")
    renovasi = relationship("Renovasi", back_populates="user", cascade="all, delete-orphan")


class Keuangan(Base):
    __tablename__ = "keuangan"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    pemasukan: Mapped[int] = mapped_column(Integer, default=0)
    pengeluaran: Mapped[int] = mapped_column(Integer, default=0)
    jenis_pengeluaran: Mapped[str | None] = mapped_column(String(50), nullable=True)
    jenis_pemasukan: Mapped[str | None] = mapped_column(String(50), nullable=True)
    tanggal: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    deskripsi: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="keuangan")


class Sarpras(Base):
    __tablename__ = "sarpras"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    foto: Mapped[str] = mapped_column(String(255), nullable=True)
    barang: Mapped[str] = mapped_column(String(255), nullable=False)
    kondisi: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    user = relationship("User", back_populates="sarpras")


class JadwalDKM(Base):
    __tablename__ = "jadwal_dkm"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tanggal: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    imam: Mapped[str] = mapped_column(String(255), nullable=False)
    kategori_imam: Mapped[str] = mapped_column(String(100), nullable=False)
    khatib: Mapped[str | None] = mapped_column(String(255), nullable=True)
    kategori_khatib: Mapped[str | None] = mapped_column(String(100), nullable=True)
    muadzin: Mapped[str | None] = mapped_column(String(255), nullable=True)
    kategori_muadzin: Mapped[str | None] = mapped_column(String(100), nullable=True)

    user = relationship("User", back_populates="jadwal_dkm")


class ProkerDKM(Base):
    __tablename__ = "proker_dkm"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    kegiatan_dkm: Mapped[str] = mapped_column(String(255), nullable=False)
    waktu_kegiatan: Mapped[Time] = mapped_column(Time, nullable=False)
    tanggal_kegiatan: Mapped[Date] = mapped_column(Date, nullable=False, index=True)

    user = relationship("User", back_populates="proker_dkm")


class Renovasi(Base):
    __tablename__ = "renovasi"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    jenis_perbaikan: Mapped[str] = mapped_column(String(255), nullable=False)
    tanggal_perbaikan: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)

    user = relationship("User", back_populates="renovasi")


class Backup(Base):
    __tablename__ = "backups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    db: Mapped[str] = mapped_column(String(255), nullable=False)
    tanggal: Mapped[Date] = mapped_column(Date, nullable=False)
