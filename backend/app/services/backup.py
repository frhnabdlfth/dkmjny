import os
from datetime import date, datetime, time
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import text

from app.core.config import get_settings
from app.models.entities import Backup

settings = get_settings()


def _sql_value(value):
    if value is None:
        return "NULL"

    if isinstance(value, datetime):
        return f"'{value.strftime('%Y-%m-%d %H:%M:%S')}'"

    if isinstance(value, date):
        return f"'{value.strftime('%Y-%m-%d')}'"

    if isinstance(value, time):
        return f"'{value.strftime('%H:%M:%S')}'"

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, (int, float)):
        return str(value)

    escaped = str(value).replace("\\", "\\\\").replace("'", "''")
    return f"'{escaped}'"


def create_backup(db):
    try:
        os.makedirs(settings.backup_dir, exist_ok=True)

        now = datetime.now()
        filename = f"{settings.database_name}_{now.strftime('%Y%m%d_%H%M%S')}.sql"
        filepath = os.path.join(settings.backup_dir, filename)

        tables_result = db.execute(text("SHOW TABLES"))
        tables = [row[0] for row in tables_result.fetchall()]

        with open(filepath, "w", encoding="utf-8") as file:
            file.write(f"-- Backup database: {settings.database_name}\n")
            file.write(f"-- Created at: {now.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            file.write("SET FOREIGN_KEY_CHECKS=0;\n\n")

            for table in tables:
                create_table_result = db.execute(text(f"SHOW CREATE TABLE `{table}`"))
                create_table_row = create_table_result.fetchone()

                if not create_table_row:
                    continue

                create_table_sql = create_table_row[1]

                file.write(f"DROP TABLE IF EXISTS `{table}`;\n")
                file.write(f"{create_table_sql};\n\n")

                rows_result = db.execute(text(f"SELECT * FROM `{table}`"))
                rows = rows_result.fetchall()
                columns = list(rows_result.keys())

                if not rows:
                    continue

                column_names = ", ".join([f"`{column}`" for column in columns])

                for row in rows:
                    values = ", ".join([_sql_value(value) for value in row])
                    file.write(
                        f"INSERT INTO `{table}` ({column_names}) VALUES ({values});\n"
                    )

                file.write("\n")

            file.write("SET FOREIGN_KEY_CHECKS=1;\n")

        backup = Backup(
            db=settings.database_name,
            tanggal=now.date(),
        )

        db.add(backup)
        db.commit()
        db.refresh(backup)

        return backup

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        )
    
def delete_backup_file(db, backup):
    try:
        db.delete(backup)
        db.commit()

        return {
            "message": "Backup berhasil dihapus",
            "id": backup.id,
        }

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {str(error)}",
        )