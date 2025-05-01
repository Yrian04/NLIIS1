import natasha
from fastapi import Depends

from src.database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_emb():
    emb = natasha.NewsEmbedding()
    yield emb


def get_segmenter():
    segmenter = natasha.Segmenter()
    yield segmenter


def get_tagger(
    emb = Depends(get_emb)
):
    tagger = natasha.NewsMorphTagger(emb)
    yield tagger


def get_vocab():
    vocab = natasha.MorphVocab()
    yield vocab
