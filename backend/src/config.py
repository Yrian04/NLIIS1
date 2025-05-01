from pydantic_settings import BaseSettings


class Config(BaseSettings):
    DATABASE_URL: str
    UPLOAD_PATH: str


settings = Config()