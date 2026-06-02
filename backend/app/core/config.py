from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DKMJNY API"
    app_env: str = "local"

    database_host: str = "localhost"
    database_port: int = 3306
    database_name: str = "dkmjny"
    database_user: str = "root"
    database_password: str = ""

    cors_origins: str = "http://localhost:5173"
    jwt_secret: str = "change-this-secret"
    backup_dir: str = "./storage/backups"
    mysqldump_path: str = "mysqldump"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]

    @property
    def sqlalchemy_database_url(self) -> str:
        password_part = f":{self.database_password}" if self.database_password else ""

        return (
            f"mysql+pymysql://{self.database_user}"
            f"{password_part}@"
            f"{self.database_host}:"
            f"{self.database_port}/"
            f"{self.database_name}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()