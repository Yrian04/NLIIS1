// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Upload } from 'lucide-react';
import { UploadPDF } from '../components/UploadPDF';
import { TextList } from '../components/TextList';
import { TextViewer } from '../components/TextViewer';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start space-x-4 h-16">
            <div className="flex items-center">
              <LayoutDashboard className="mr-2" />
              <span className="font-semibold text-lg">Text Dictionary</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload size={18} />
                Загрузить
              </Link>
              <Link
                to="/texts"
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FileText size={18} />
                Тексты
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-8 px-4">
        <Routes>
          <Route path="/" element={<UploadPDF />} />
          <Route path="/texts" element={<TextList />} />
          <Route path="/texts/:textId" element={<TextViewer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};