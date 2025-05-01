from typing import List
from sqlalchemy import ForeignKey, Table, Column, Text, Integer
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.models import Base


class WordForm(Base):
    __tablename__ = 'word_form'
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    word: Mapped[str] = mapped_column(nullable=False)
    lemma_id: Mapped[int] = mapped_column(ForeignKey("lemma.id"))

    lemma = relationship("Lemma", back_populates='word_forms')


class Lemma(Base):
    __tablename__ = 'lemma'
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    lemma: Mapped[str] = mapped_column(nullable=False)
    word_forms: Mapped[List["WordForm"]] = relationship(
        back_populates='lemma',
        cascade="all, delete-orphan"
    )


text_word_forms = Table(
    "text_word_forms",
    Base.metadata,
    Column("text", ForeignKey("text.id"), primary_key=True),
    Column("word_form", ForeignKey("word_form.id"), primary_key=True),
    Column("description", Text, default=''),
    Column("count", Integer, default=1)
)


class Text(Base):
    __tablename__ = 'text'
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    file: Mapped[str] = mapped_column(nullable=False)
    word_forms: Mapped[List["WordForm"]] = relationship(secondary=text_word_forms)
