import React from 'react';
import { STORAGE_KEYS } from '../data/gameData';
import { DEFAULT_USER_PREFERENCES, TRANSLATIONS } from '../data/translations';

const WaitingScreen = ({ nickname }) => {
  // 언어 설정 불러오기
  const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) || DEFAULT_USER_PREFERENCES;
  const language = preferences.language || 'ko';
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-black flex justify-center items-center p-4">
      <div className="w-[500px] bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-black"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.waitingTitle}
          </h2>
          
          <p className="text-gray-600 mb-4">
            <span className="font-semibold text-red-600">{nickname}</span>{t.waitingNicknameSuffix}
          </p>
          
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="font-semibold text-black mb-2">{t.waitingBubbles[0]}</h3>
          <p className="text-sm text-red-600">
            {t.waitingBubbles[1]}
          </p>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>{t.waitingTips[0]}</p>
          <p>{t.waitingTips[1]}</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen; 