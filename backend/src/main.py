import os

from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import FileResponse

import src.dictionary as dictionary

from src.database import engine
from src.models import Base
from src.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    middleware=[
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],  # или указать домен фронтенда
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # ваш фронтенд
    ],
    allow_credentials=True,
    allow_methods=["*"],  # разрешить все методы
    allow_headers=["*"],  # разрешить все заголовки
)

app.include_router(dictionary.router)

@app.get('/')
def root():
    return {'messenge': 'Hello, world!'}

@app.get('/files/{filename}')
def get_file(
    filename: str
):
    return FileResponse(os.path.join(settings.UPLOAD_PATH, filename))
