from app.services.file_service import FileService
from app.models.entities import Sarpras


class SarprasService:

    @staticmethod
    def create(db, data, file):
        filename = None

        if file and file.filename:
            filename = FileService.save_image(file)

        sarpras = Sarpras(
            user_id=data.user_id,
            barang=data.barang,
            kondisi=data.kondisi,
            foto=filename
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
    def update(db, sarpras_id: int, data, file=None):
        print("file:", file)
        print("file.filename:", file.filename if file else "NONE")
        
        sarpras = db.query(Sarpras).filter(Sarpras.id == sarpras_id).first()

        if not sarpras:
            return None

        sarpras.barang = data.barang or sarpras.barang
        sarpras.kondisi = data.kondisi or sarpras.kondisi

        if file and file.filename:  # ← tambah pengecekan file.filename
            FileService.delete_image(sarpras.foto)
            sarpras.foto = FileService.save_image(file)

        db.commit()
        db.refresh(sarpras)

        return sarpras