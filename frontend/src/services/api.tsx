// src/services/api.ts
import axios, { AxiosProgressEvent } from 'axios';
import {
  Text as TextType,
  WordForm,
  Lemma,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ваш бэкенд
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Тексты
export const getAllTexts = async (): Promise<TextType[]> => {
  const res = await api.get('/dictionary/texts');
  return res.data;
};

// src/services/api.ts
export const getTextById = async (id: number): Promise<{ id: number; file: string }> => {
  const res = await api.get(`/dictionary/texts/${id}`);
  return res.data;
};

// Словоформы
// src/services/api.ts
export const getWordFormsByTextId = async (
  textId: number,
  page: number = 1,
  perPage: number = 20
): Promise<Array<[WordForm, number]>> => {
  const res = await api.get(`/dictionary/texts/${textId}/word_forms`, {
    params: { page, per_page: perPage },
  });
  return res.data;
};

export const updateWordFormDescription = async (
  textId: number,
  wordFormId: number,
  wordForm: any
): Promise<void> => {
  await api.put(`/dictionary/texts/${textId}/word_forms/${wordFormId}`, wordForm);
};

// Загрузка PDF
// src/services/api.ts
// src/services/api.ts
// src/services/api.ts
export const uploadPdf = async (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<{ id: number; file: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/dictionary/texts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress, // ✅ Передаем прогресс в Axios
  });

  return res.data;
};