// src/components/TextList.tsx
import React, { useEffect, useState } from 'react';
import { getAllTexts } from '../services/api';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import { Text } from '../types/index'

export const TextList: React.FC = () => {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const data = await getAllTexts();
        setTexts(data);
      } catch (error) {
        console.error('Ошибка получения текстов:', error);
        setError('Не удалось загрузить тексты');
      } finally {
        setLoading(false);
      }
    };
    fetchTexts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">Все тексты</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {texts.map((text) => (
          <div
            key={text.id}
            className="card overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="text-blue-500" size={24} />
                <h3 className="text-xl font-semibold">Текст #{text.id}</h3>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock size={16} />
                <span>{text.file}...</span>
              </div>
              <Link
                to={`/texts/${text.id}`}
                className="block mt-4 btn-primary text-center"
              >
                Открыть
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};