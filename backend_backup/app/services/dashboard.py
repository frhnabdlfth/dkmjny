from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.entities import Keuangan, ProkerDKM, Renovasi, Sarpras


def get_dashboard_summary(db: Session) -> dict:
    kondisi_rows = db.execute(select(Sarpras.kondisi, func.count(Sarpras.id)).group_by(Sarpras.kondisi)).all()
    kondisi = {str(name.value if hasattr(name, "value") else name): total for name, total in kondisi_rows}

    finance_rows = db.execute(
        select(Keuangan.tanggal, func.sum(Keuangan.pemasukan), func.sum(Keuangan.pengeluaran))
        .group_by(Keuangan.tanggal)
        .order_by(Keuangan.tanggal)
        .limit(12)
    ).all()

    schedules = db.scalars(select(ProkerDKM).order_by(ProkerDKM.tanggal_kegiatan.asc()).limit(6)).all()
    renovations = db.scalars(select(Renovasi).order_by(Renovasi.tanggal_perbaikan.desc()).limit(6)).all()

    return {
        "sarpras": {
            "bagus": kondisi.get("Bagus", 0),
            "rusak": kondisi.get("Rusak", 0),
            "perlu_diperbaiki": kondisi.get("Perlu Diperbaiki", 0),
        },
        "finance_chart": [
            {"tanggal": row[0].isoformat(), "pemasukan": int(row[1] or 0), "pengeluaran": int(row[2] or 0)}
            for row in finance_rows
        ],
        "schedules": [
            {
                "id": row.id,
                "kegiatan_dkm": row.kegiatan_dkm,
                "tanggal_kegiatan": row.tanggal_kegiatan.isoformat(),
                "waktu_kegiatan": row.waktu_kegiatan.strftime("%H:%M"),
            }
            for row in schedules
        ],
        "renovations": [
            {
                "id": row.id,
                "jenis_perbaikan": row.jenis_perbaikan,
                "tanggal_perbaikan": row.tanggal_perbaikan.isoformat(),
                "progress": row.progress,
            }
            for row in renovations
        ],
    }
