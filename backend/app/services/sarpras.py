import logging

from app.models.entities import Sarpras
from app.services.file_service import FileService

logger = logging.getLogger(__name__)


class SarprasService:

    @staticmethod
    def create(db, data, foto=None) -> Sarpras:
        filename = None

        if foto and foto.filename:
            filename = FileService.save_image(foto)

        sarpras = Sarpras(
            user_id=data.user_id,
            barang=data.barang,
            kondisi=data.kondisi,
            foto=filename,
        )

        db.add(sarpras)
        db.commit()
        db.refresh(sarpras)

        return sarpras

    @staticmethod
    def update(db, sarpras_id: int, data, foto=None):
        sarpras = db.query(Sarpras).filter(Sarpras.id == sarpras_id).first()

        if not sarpras:
            return None

        if data.barang is not None:
            sarpras.barang = data.barang
        if data.kondisi is not None:
            sarpras.kondisi = data.kondisi

        if foto and foto.filename:
            old_foto = sarpras.foto
            sarpras.foto = FileService.save_image(foto)
            FileService.delete_image(old_foto)

        db.commit()
        db.refresh(sarpras)

        return sarpras

    @staticmethod
    def delete(db, sarpras_id: int):
        sarpras = db.query(Sarpras).filter(Sarpras.id == sarpras_id).first()

        if not sarpras:
            return None

        foto_to_delete = sarpras.foto

        db.delete(sarpras)
        db.commit()

        if foto_to_delete:
            deleted = FileService.delete_image(foto_to_delete)
            if not deleted:
                logger.warning(
                    "Sarpras id=%s dihapus dari DB, "
                    "tapi foto '%s' tidak ditemukan di storage.",
                    sarpras_id, foto_to_delete,
                )

        return sarpras