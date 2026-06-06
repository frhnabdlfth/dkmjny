import os
import uuid
import logging
from io import BytesIO
from pathlib import Path
from typing import Optional

from PIL import Image, ImageOps

logger = logging.getLogger(__name__)


class FileService:
    BASE_PATH = Path("./storage")
    IMAGE_PATH = BASE_PATH / "image"

    MAX_DIMENSION = 1200
    JPEG_QUALITY   = 82
    OPTIMIZE       = True
    ALLOWED_MIME   = {"image/jpeg", "image/png", "image/webp"}
    ALLOWED_EXT    = {".jpg", ".jpeg", ".png", ".webp"}

    @classmethod
    def _ensure_folder(cls) -> None:
        cls.IMAGE_PATH.mkdir(parents=True, exist_ok=True)

    @classmethod
    def _is_allowed(cls, filename: str) -> bool:
        return Path(filename).suffix.lower() in cls.ALLOWED_EXT

    @classmethod
    def _compress(cls, raw_bytes: bytes) -> bytes:
        """
        Buka gambar, perbaiki orientasi EXIF, resize jika perlu,
        lalu kembalikan bytes JPEG yang sudah terkompresi.
        """
        img: Image.Image = Image.open(BytesIO(raw_bytes))

        img = ImageOps.exif_transpose(img)

        if img.mode != "RGB":
            if img.mode in ("RGBA", "PA"):
                background = Image.new("RGB", img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                img = background
            else:
                img = img.convert("RGB")

        if max(img.size) > cls.MAX_DIMENSION:
            img.thumbnail(
                (cls.MAX_DIMENSION, cls.MAX_DIMENSION),
                Image.LANCZOS,
            )

        buf = BytesIO()
        img.save(
            buf,
            format="JPEG",
            quality=cls.JPEG_QUALITY,
            optimize=cls.OPTIMIZE,
        )
        return buf.getvalue()

    @classmethod
    def save_image(cls, file) -> str:
        """
        Terima UploadFile FastAPI, kompres, simpan ke storage/image/.
        Selalu disimpan sebagai .jpg (JPEG) terlepas dari format asli.
        Kembalikan nama file yang disimpan (tanpa path).
        """
        cls._ensure_folder()

        if not cls._is_allowed(file.filename):
            raise ValueError(
                f"Format file tidak didukung. "
                f"Gunakan: {', '.join(cls.ALLOWED_EXT)}"
            )

        raw_bytes   = file.file.read()
        compressed  = cls._compress(raw_bytes)

        filename    = f"{uuid.uuid4().hex}.jpg"
        file_path   = cls.IMAGE_PATH / filename

        file_path.write_bytes(compressed)

        orig_kb  = len(raw_bytes)   / 1024
        final_kb = len(compressed)  / 1024
        logger.info(
            "Foto tersimpan: %s | %.1f KB → %.1f KB (%.0f%%)",
            filename, orig_kb, final_kb, (final_kb / orig_kb * 100) if orig_kb else 0,
        )

        return filename

    @classmethod
    def delete_image(cls, filename: Optional[str]) -> bool:
        """
        Hapus file dari storage/image/.
        Aman dipanggil walau filename None atau file tidak ada.
        """
        if not filename:
            return False

        clean = (
            filename
            .replace("storage/image/", "")
            .replace("storage\\image\\", "")
            .lstrip("/\\")
        )

        file_path = cls.IMAGE_PATH / clean

        try:
            if file_path.exists():
                file_path.unlink()
                logger.info("Foto dihapus: %s", clean)
                return True
            else:
                logger.warning("File tidak ditemukan saat dihapus: %s", file_path)
                return False
        except OSError as exc:
            logger.error("Gagal menghapus file %s: %s", file_path, exc)
            return False