from __future__ import annotations

from src.schemas import CustomModel


class WordFormModel(CustomModel):
    id: int
    word: str
    lemma: LemmaModel
    description: str


class LemmaModel(CustomModel):
    id: int
    lemma: str


class TextModel(CustomModel):
    id: int
    file: str
