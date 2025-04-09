import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function Activity() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('activities')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Memory Game */}
        <Link to="/memory-game">
          <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('memoryGame')}</h2>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        </Link>

        {/* Puzzle Game */}
        <Link to="/puzzle-game">
          <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('puzzleGame')}</h2>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        </Link>

        {/* Word Search */}
        <Link to="/word-search">
          <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('wordSearch')}</h2>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        </Link>
      </div>
    </div>
  );
} 