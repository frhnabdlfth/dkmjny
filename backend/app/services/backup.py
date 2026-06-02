from datetime import date
from pathlib import Path
import os
import subprocess
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.models.entities import Backup


def create_backup(db: Session, user_id: int = 1) -> Backup:
    settings = get_settings()
    backup_dir = Path(settings.backup_dir)
    backup_dir.mkdir(parents=True, exist_ok=True)
    filename = f"db_dkmjny_{date.today().isoformat()}.sql"
    output_path = backup_dir / filename

    # Simple mysqldump support for local/dev servers. In production, run with least-privileged DB user.
    database_url = settings.database_url.replace("mysql+pymysql://", "")
    auth_host, database_name = database_url.rsplit("/", 1)
    auth, host_port = auth_host.split("@")
    username, password = auth.split(":", 1)
    host, port = host_port.split(":") if ":" in host_port else (host_port, "3306")

    command = [settings.mysqldump_path, "-h", host, "-P", port, "-u", username]
    if password:
        command.append(f"-p{password}")
    command.append(database_name)

    try:
        with output_path.open("w", encoding="utf-8") as handle:
            subprocess.run(command, stdout=handle, stderr=subprocess.PIPE, check=True, text=True)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Backup gagal: {exc}") from exc

    item = Backup(user_id=user_id, db=filename, tanggal=date.today())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def delete_backup_file(db: Session, item: Backup) -> None:
    settings = get_settings()
    file_path = Path(settings.backup_dir) / item.db
    if file_path.exists():
        os.remove(file_path)
    db.delete(item)
    db.commit()
