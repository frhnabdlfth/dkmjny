from pydantic import BaseModel, ConfigDict


class Message(BaseModel):
    message: str


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
