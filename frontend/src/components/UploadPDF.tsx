// src/components/UploadPDF.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Импортируем
import { uploadPdf } from '../services/api';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { AxiosProgressEvent } from 'axios';

export const UploadPDF: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // ✅ Состояние загрузки
  const [error, setError] = useState<string | null>(null); // ✅ Состояние ошибки
  // UploadPDF.tsx
  const [progress, setProgress] = useState<number | null>(null);


  const navigate = useNavigate(); // ✅ Инициализируем

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      await handleUpload(droppedFile); // ✅ Вызываем отдельную функцию
    } else {
      alert('Пожалуйста, загрузите PDF');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      handleUpload(selectedFile); // ✅ Вызываем отдельную функцию
    } else {
      alert('Пожалуйста, выберите PDF');
    }
  };

  // В функции handleUpload

  const handleUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const data = await uploadPdf(fileToUpload, (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        }
      });

      setProgress(null);
      navigate(`/texts/${data.id}`);
    } catch (err: any) {
      console.error('Ошибка загрузки:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Загрузка превысила 60 секунд. Попробуйте загрузить файл позже.');
      } else {
        setError('Не удалось загрузить файл. Попробуйте ещё раз.');
      }
      setProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <h3 className="mt-4 text-lg font-medium">Файл обрабатывается...</h3>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 w-full max-w-md mx-auto transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        {file ? (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
            <h3 className="mt-4 text-lg font-medium">Файл загружен</h3>
            <p className="text-sm text-gray-500 mt-1">{file.name}</p>
            <button
              onClick={() => setFile(null)}
              className="mt-4 btn-primary"
            >
              Загрузить другой
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto text-gray-400 w-16 h-16" />
            <h3 className="mt-4 text-lg font-medium">Перетащите PDF сюда</h3>
            <p className="text-sm text-gray-500 mt-1">или нажмите, чтобы выбрать файл</p>
            <button
              onClick={() => document.getElementById('fileInput')?.click()}
              className="mt-4 btn-primary"
            >
              Выбрать файл
            </button>
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};