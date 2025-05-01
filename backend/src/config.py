from pydantic_settings import BaseSettings


class Config(BaseSettings):
    DATABASE_URL: str
    UPLOAD_PATH: str

    class Config:
        env_file = '.env'


settings = Config()