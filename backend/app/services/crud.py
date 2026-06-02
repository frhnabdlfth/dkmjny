from typing import Any, TypeVar
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import Base

ModelType = TypeVar("ModelType", bound=Base)


def list_items(db: Session, model: type[ModelType], skip: int = 0, limit: int = 100) -> list[ModelType]:
    return list(db.scalars(select(model).offset(skip).limit(limit)).all())


def get_item(db: Session, model: type[ModelType], item_id: int) -> ModelType:
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan")
    return item


def create_item(db: Session, model: type[ModelType], payload: Any) -> ModelType:
    item = model(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(db: Session, item: ModelType, payload: Any) -> ModelType:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: ModelType) -> None:
    db.delete(item)
    db.commit()
