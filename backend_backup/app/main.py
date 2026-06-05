from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import router
from app.core.config import get_settings
from app.db.session import Base, engine
from app.models import entities

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/storage",
    StaticFiles(directory="storage"),
    name="storage"
)

@app.get("/")
def root():
    return {
        "DKMJNY API is running",
    }

app.include_router(router)
