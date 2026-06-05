from app.services.file_service import FileService
from app.models.entities import Sarpras


class SarprasService:

    @staticmethod
    def create(db, data, foto=None):
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
    def delete(db, sarpras_id: int):
        sarpras = db.query(Sarpras).filter(Sarpras.id == sarpras_id).first()

        if not sarpras:
            return None

        FileService.delete_image(sarpras.foto)

        db.delete(sarpras)
        db.commit()

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

        # Only replace the file when a new one is actually uploaded
        if foto and foto.filename:
            FileService.delete_image(sarpras.foto)
            sarpras.foto = FileService.save_image(foto)

        db.commit()
        db.refresh(sarpras)

        return sarpras
