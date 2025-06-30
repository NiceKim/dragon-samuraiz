import React, { useState, useEffect } from 'react';
import useAudio from '../hooks/useAudio';
import { STORAGE_KEYS } from '../data/gameData';
import { DEFAULT_USER_PREFERENCES, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations';
import GameRulesPopup from './GameRulesPopup';

const HomeScreen = ({ onStartGame, isConnected }) => {
  const [nickname, setNickname] = useState('');
  const [showRules, setShowRules] = useState(false);
  const { toggleMute } = useAudio();
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState('ko');

  // 사용자 설정 가져오기
  const getUserPreferences = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return saved ? JSON.parse(saved) : DEFAULT_USER_PREFERENCES;
  };

  // 사용자 설정 저장하기
  const saveUserPreferences = (preferences) => {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  };

  // 컴포넌트 마운트 시 localStorage에서 닉네임과 사용자 설정 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('gameNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
    
    // 사용자 설정 초기화
    const preferences = getUserPreferences();
    setIsMuted(preferences.audioMuted);
    setLanguage(preferences.language);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    
    if (trimmedNickname) {
      // 닉네임을 localStorage에 저장
      localStorage.setItem('gameNickname', trimmedNickname);
      onStartGame(trimmedNickname);
    } else {
      // 빈 값이면 클라이언트에서 랜덤 생성
      const randomNickname = generateRandomNickname();
      setNickname(randomNickname);
      localStorage.setItem('gameNickname', randomNickname);
      onStartGame(randomNickname);
    }
  };

  const handleToggleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // 사용자 설정 업데이트 및 저장
    const preferences = getUserPreferences();
    preferences.language = newLanguage;
    saveUserPreferences(preferences);
  };

  // 랜덤 닉네임 생성
  const generateRandomNickname = () => {
    const t = TRANSLATIONS[language];
    const adj = t.NICKNAME_ADJECTIVES[Math.floor(Math.random() * t.NICKNAME_ADJECTIVES.length)];
    const noun = t.NICKNAME_NOUNS[Math.floor(Math.random() * t.NICKNAME_NOUNS.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${number}`;
  };

  const handleRandomNickname = () => {
    const randomNickname = generateRandomNickname();
    setNickname(randomNickname);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {TRANSLATIONS[language].title}
          </h1>
          <p className="text-gray-600">
            {TRANSLATIONS[language].subtitle}
          </p>
        </div>

        <div className="mb-6">
          <div className={`flex items-center justify-center mb-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? TRANSLATIONS[language].connected : TRANSLATIONS[language].connecting}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              {TRANSLATIONS[language].nickname}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={TRANSLATIONS[language].nicknamePlaceholder}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleRandomNickname}
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
                title="랜덤 닉네임 생성"
              >
                <span className="text-lg">🎲</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {TRANSLATIONS[language].nicknameHelp}
            </p>
          </div>

          <button
            type="submit"
            disabled={!isConnected}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
              isConnected
                ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isConnected ? TRANSLATIONS[language].startGame : TRANSLATIONS[language].waitingConnection}
          </button>
        </form>

        {/* 게임 시작 버튼 아래 설정 버튼들 */}
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-3">
            {/* 음소거 버튼 */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="flex flex-col items-center justify-center space-y-2 px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200 border border-gray-200"
            >
              <span className="text-xl">
                {isMuted ? '🔇' : '🔊'}
              </span>
              <span className="text-xs font-medium text-gray-700 text-center">
                {isMuted ? TRANSLATIONS[language].unmute : TRANSLATIONS[language].mute}
              </span>
            </button>

            {/* 언어 설정 버튼 */}
            <button
              type="button"
              onClick={() => handleLanguageChange(language === 'ko' ? 'en' : 'ko')}
              className="flex flex-col items-center justify-center space-y-2 px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200 border border-gray-200"
            >
              <span className="text-xl">🌐</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                {SUPPORTED_LANGUAGES[language]}
              </span>
            </button>

            {/* 게임 규칙 버튼 */}
            <button
              type="button"
              onClick={() => {
                setShowRules(true);
              }}
              className="flex flex-col items-center justify-center space-y-2 px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200 border border-gray-200"
            >
              <span className="text-xl">📖</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                {TRANSLATIONS[language].gameRules}
              </span>
            </button>
          </div>
        </div>
      </div>

      <GameRulesPopup 
        isOpen={showRules} 
        onClose={() => setShowRules(false)} 
        language={language} 
      />
    </div>
  );
};

export default HomeScreen; 