import os
import uuid
from pathlib import Path
from typing import Optional


class FileService:
    BASE_PATH = Path("./storage")
    IMAGE_PATH = BASE_PATH / "image"

    @classmethod
    def ensure_folder(cls):
        cls.IMAGE_PATH.mkdir(parents=True, exist_ok=True)

    @classmethod
    def generate_filename(cls, original_filename: str) -> str:
        ext = os.path.splitext(original_filename)[1]
        return f"{uuid.uuid4().hex}{ext}"

    @classmethod
    def save_image(cls, file) -> str:
        cls.ensure_folder()

        filename = cls.generate_filename(file.filename)
        file_path = cls.IMAGE_PATH / filename

        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        return filename

    @classmethod
    def delete_image(cls, filename: Optional[str]) -> bool:
        if not filename:
            return False

        file_path = cls.IMAGE_PATH / filename

        if file_path.exists():
            file_path.unlink()
            return True

        return False