import os
from functools import reduce
from typing import List, Tuple

import natasha
from fastapi import Depends
from sqlalchemy import (
    insert,
    select, 
    update,
    exists, 
    func, 
)
from sqlalchemy.orm import Session, joinedload
from PyPDF2 import PdfReader

from src.config import settings

from .dependencies import (
    get_db,
    get_segmenter,
    get_vocab,
    get_tagger
)
from .models import *


class TextService:
    def __init__(
        self,
        db: Session = Depends(get_db),
        segmenter: natasha.Segmenter = Depends(get_segmenter),
        tagger: natasha.NewsMorphTagger = Depends(get_tagger),
        vocab: natasha.MorphVocab = Depends(get_vocab),
    ):
        self.db = db
        self.segmenter = segmenter
        self.tagger = tagger
        self.vocab = vocab

    def get_text(
        self,
        id: int
    ) -> Text:
        text = self.db.query(Text).get(id)
        return text
    
    def get_all_texts(
        self,
    ) -> list[Text]:
        texts = self.db.query(Text).all()
        return texts

    def get_word_forms_from_text(
        self,
        text_content: str
    ) -> list[WordForm]:
        doc = natasha.Doc(text_content)
        doc.segment(self.segmenter)
        doc.tag_morph(self.tagger)
        for token in doc.tokens:
            token.lemmatize(self.vocab)
        return [
            self.create_word_form(token.text, token.lemma)
            for token in doc.tokens if token.text.isalpha()
        ]
    
    def create_word_form(
        self,
        word: str,
        lemma: str,
    ) -> WordForm:
        word_form =  WordForm(
            word=word,
            lemma=self.get_lemma
            (
                lemma
            )
        )
        self.db.add(word_form)
        self.db.commit()
        return word_form
    
    def get_lemma(
        self,
        lemma_word: str
    ) -> Lemma:
        lemma = self.db.query(Lemma).where(Lemma.lemma == lemma_word).first()
        if lemma is None:
            lemma = Lemma(
                lemma=lemma_word
            )
            self.db.add(lemma)
            self.db.commit()
        return lemma

    def get_text_from_pdf(
        self,
        filepath: os.PathLike
    ) -> Text:
        reader = PdfReader(os.path.join(settings.UPLOAD_PATH, filepath))
        pages = [page.extract_text() for page in reader.pages]
        content = reduce(lambda x, y: x + y, pages, '')
        text = Text(
            file=filepath,
            word_forms=self.get_word_forms_from_text(content)
        )
        self.db.add(text)
        self.db.commit()
        self.db.refresh(text)
        return text
    
    def get_word_forms_of_text(
        self,
        text_id: int,
        page: int = 1,
        per_page: int = 20
    ) -> List[Tuple[WordForm, int]]:
        stmt = (
            select(
                WordForm, 
                func.count(WordForm.id).label("count")
            )
            .join(
                text_word_forms,
                WordForm.id == text_word_forms.c.word_form
            )
            .where(text_word_forms.c.text == text_id)
            .options(joinedload(WordForm.lemma))
            .group_by(WordForm.word)
            .order_by(WordForm.word.asc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        return [(wf, count) for wf, count in self.db.execute(stmt).all()]

    def get_word_form_description(
        self,
        word_form_id: int,
        text_id: int, 
    ) -> str:
        stmt = (
            select(
                text_word_forms.c.description
            )
            .where(
                text_word_forms.c.word_form == word_form_id and
                text_word_forms.c.text == text_id
            )
        )
        return self.db.execute(stmt).first()[0]
    
    def set_word_form_description(
        self,
        description: str,
        word_form_id: int,
        text_id: int, 
    ) -> str:
        update_stmt = (
            update(
                text_word_forms
            )
            .where(
                (text_word_forms.c.word_form == word_form_id) &
                (text_word_forms.c.text == text_id)
            )
            .values(description=description)
        )
        self.db.execute(update_stmt)
        self.db.commit()
        return description
  
    def create_lemma(
        self,
        lemma: str
    ) -> Lemma:
        stmt = (
            insert(Lemma)
            .values(
                lemma=lemma
            )
        )
        result = self.db.execute(stmt).first()
        return result[0]
    
    # def create_word_form(
    #     self,
    #     word: str,
    #     lemma: Lemma | str
    # ) -> WordForm:
    #     match lemma:
    #         case str():
    #             lemma = self.get_lemma(lemma)
    #     stmt = (
    #         insert(WordForm)
    #         .values(
    #             word=word,
    #             lemma_id=lemma.id
    #         )
    #     )
    #     result = self.db.execute(stmt).first()
    #     self.db.commit()
    #     return result[0]
    
    def create_text(
        self,
        content: str
    ) -> Text:
        ...
