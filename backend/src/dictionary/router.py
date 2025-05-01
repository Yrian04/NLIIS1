import os
from typing import List, Tuple

from fastapi import APIRouter, Depends, UploadFile

from src.config import settings

from .services import TextService
from .models import *
from .schemas import *

router = APIRouter(prefix='/dictionary', tags=['Dictionary'])

@router.get('/texts')
async def get_texts(
    text_service: TextService = Depends(TextService)
) -> List[TextModel]:
    texts = text_service.get_all_texts()
    return [
        TextModel(
            id=t.id,
            file=t.file,
        )
        for t in texts
    ]


@router.post('/texts')
async def upload_pdf(
    file: UploadFile,
    text_service: TextService = Depends(TextService)
):
    os.makedirs(settings.UPLOAD_PATH, exist_ok=True)
    filepath = os.path.join(settings.UPLOAD_PATH, file.filename)
    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())
    text = text_service.get_text_from_pdf(file.filename)
    return TextModel(
        id=text.id,
        file=text.file
    )


@router.get('/texts/{text_id}')
async def get_text(
    text_id: int,
    text_service: TextService = Depends(TextService)
) -> TextModel:
    text = text_service.get_text(text_id)
    return TextModel(
        id=text.id,
        file=text.file
    )


@router.get('/texts/{text_id}/word_forms')
async def get_text_word_forms(
    text_id: int,
    page: int = 1,
    per_page: int = 20,
    text_service: TextService = Depends(TextService)
) -> List[Tuple[WordFormModel, int]]:
    word_forms = text_service.get_word_forms_of_text(
        text_id,
        page, 
        per_page
    )
    return [
        (
            WordFormModel(
                id=wf.id,
                word=wf.word,
                lemma=LemmaModel(
                    id=wf.lemma_id,
                    lemma=wf.lemma.lemma
                ),
                description = text_service.get_word_form_description(
                    wf.id,
                    text_id
                )
            ),
            count
        )
        for wf, count in word_forms
    ]


@router.put('/texts/{text_id}/word_forms/{word_form_id}')
async def set_word_form_descrption(
    word_form_id: int,
    text_id: int,
    word_form: WordFormModel,
    text_service: TextService = Depends(TextService)
):
    result = text_service.set_word_form_description(
        word_form.description,
        word_form_id,
        text_id
    )
    return result

