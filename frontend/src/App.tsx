// src/App.tsx
import React from 'react';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Словарь словоформ</h1>
      <AppRouter />
    </div>
  );
}

export default App;