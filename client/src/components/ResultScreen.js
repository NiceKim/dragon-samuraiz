import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_STATS, 
  STORAGE_KEYS 
} from '../data/gameData';
import { TRANSLATIONS, DEFAULT_USER_PREFERENCES } from '../data/translations';
import useAudio from '../hooks/useAudio';

const ResultScreen = ({ result, onGoHome, onRematch, onClose }) => {
  const [gameStats, setGameStats] = useState(DEFAULT_STATS);
  const { playWinSound, playLoseSound, playDrawSound } = useAudio();

  // 애니메이션 상태
  const [showAnimation, setShowAnimation] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // 언어 설정 가져오기
  const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) || DEFAULT_USER_PREFERENCES;
  const language = preferences.language || 'ko';
  const t = TRANSLATIONS[language];

  // 컴포넌트 마운트 시 저장된 통계 불러오기
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  // 게임 결과가 변경될 때 통계 업데이트 및 애니메이션 시작
  useEffect(() => {
    if (result?.result) {
      updateGameStats(result.result);
      
      // 팝업 애니메이션 시작
      setShowPopup(true);
      
      // 애니메이션 시퀀스 시작
      setTimeout(() => setShowAnimation(true), 100);
      
      // 파티클 효과 (승리/패배 시에만)
      if (result.result === 'win' || result.result === 'lose') {
        setTimeout(() => setShowParticles(true), 400);
      }
      
      // 결과 텍스트 표시 및 사운드 재생
      setTimeout(() => {
        setShowResult(true);
        
        // 결과에 따른 사운드 재생
        switch (result.result) {
          case 'win':
            playWinSound();
            break;
          case 'lose':
            playLoseSound();
            break;
          case 'draw':
          case 'timeout_draw':
            playDrawSound();
            break;
          default:
            break;
        }
      }, 700);
    }
  }, [result, playWinSound, playLoseSound, playDrawSound]);

  // 게임 통계 업데이트 및 저장
  const updateGameStats = (gameResult) => {
    setGameStats(prevStats => {
      const newStats = { ...prevStats };
      
      // 승/패만 통계에 반영 (무승부는 제외)
      if (gameResult === 'win') {
        newStats.wins += 1;
        newStats.currentStreak += 1;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
        newStats.totalGames += 1;
      } else if (gameResult === 'lose') {
        newStats.losses += 1;
        newStats.currentStreak = 0; // 연승 초기화
        newStats.totalGames += 1;
      }
      // draw, timeout_draw는 통계에 반영하지 않음
      
      newStats.lastResult = gameResult;
      
      // localStorage에 저장
      localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(newStats));
      
      return newStats;
    });
  };

  // 통계 초기화
  const resetStats = () => {
    setGameStats(DEFAULT_STATS);
    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(DEFAULT_STATS));
  };

  // 승률 계산
  const getWinRate = () => {
    if (gameStats.totalGames === 0) return '0%';
    return Math.round((gameStats.wins / gameStats.totalGames) * 100) + '%';
  };

  const getResultText = () => {
    switch (result?.result) {
      case 'win':
        return {
          text: t.WIN_TEXT,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-400',
          animation: 'animate-bounce',
          particles: ['🎊', '🏆', '⭐', '💎', '🎈', '✨']
        };
      case 'lose':
        return {
          text: t.LOSE_TEXT,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-400',
          animation: 'animate-pulse',
          particles: ['💔', '😭', '💧', '🌧️', '⚡', '💥']
        };
      case 'draw':
      case 'timeout_draw':
        return {
          text: t.DRAW_TEXT,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-400',
          animation: 'animate-pulse',
          particles: ['🤝', '⚖️', '🔄', '💫', '🌟', '✨']
        };
      default:
        return { 
          text: '❓ 결과 없음', 
          color: 'text-gray-600', 
          bg: 'bg-gray-100', 
          border: 'border-gray-400',
          animation: '',
          particles: []
        };
    }
  };

  const getChoiceText = (choice) => {
    switch (choice) {
      case 'slash':
        return `${t.slash} 🗡️`;
      case 'parry':
        return `${t.parry} 🛡️`;
      case 'focus':
        return `${t.focus} 🧘`;
      default:
        return t.NO_CHOICE;
    }
  };

  const getReasonText = () => {
    if (!result?.reason) return null;
    
    switch (result.reason) {
      case 'timeout':
        return t.TIMEOUT_REASON;
      case 'opponent_disconnected':
        return t.OPPONENT_DISCONNECTED_REASON;
      default:
        return null;
    }
  };

  const resultInfo = getResultText();

  // 파티클 컴포넌트
  const Particle = ({ emoji, delay, result }) => {
    const baseClasses = `
      absolute text-2xl animate-ping
      ${result === 'win' ? 'text-yellow-400' : result === 'lose' ? 'text-red-400' : 'text-blue-400'}
    `;
    
    const positions = [
      'top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4',
      'top-1/2 left-2', 'top-1/2 right-2', 'top-2 left-1/2', 'bottom-2 right-1/2'
    ];
    
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    
    return (
      <div 
        className={`${baseClasses} ${randomPosition}`}
        style={{ 
          animationDelay: `${delay}ms`,
          animationDuration: '2s'
        }}
      >
        {emoji}
      </div>
    );
  };

  if (!showPopup) return null;

  return (
    <>
      {/* 배경 오버레이 - 클릭 불가능 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          showAnimation ? 'opacity-50' : 'opacity-0'
        }`}
      />
      
      {/* 팝업 컨테이너 */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        {/* 파티클 효과 */}
        {showParticles && resultInfo.particles.map((particle, index) => (
          <Particle 
            key={index} 
            emoji={particle} 
            delay={index * 200} 
            result={result?.result}
          />
        ))}

        <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-500 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className="text-center mb-8">
            {/* 결과 텍스트 애니메이션 */}
            <h1 className={`text-4xl font-bold mb-4 ${resultInfo.color} transition-all duration-700 ${
              showResult ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            } ${resultInfo.animation}`}>
              {resultInfo.text}
            </h1>
            
            {/* 카드 효과 */}
            <div className={`${resultInfo.bg} ${resultInfo.border} border rounded-lg p-4 mb-6 transition-all duration-500 transform ${
              showResult ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } hover:scale-105 hover:shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">{t.GAME_RESULT}</h2>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.MY_CHOICE_LABEL}</span>
                  <span className="font-semibold text-lg animate-pulse">
                    {getChoiceText(result?.yourChoice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t.OPPONENT_CHOICE_LABEL}</span>
                  <span className="font-semibold text-lg animate-pulse">
                    {getChoiceText(result?.opponentChoice)}
                  </span>
                </div>
              </div>
            </div>

            {getReasonText() && (
              <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 transition-all duration-700 delay-300 ${
                showResult ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-sm text-blue-700">{getReasonText()}</p>
              </div>
            )}
          </div>

          {/* 버튼들 애니메이션 */}
          <div className="space-y-4">
            <button
              onClick={onRematch}
              className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-500 transform hover:scale-105 hover:shadow-lg ${
                showResult ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {t.REMATCH}
            </button>
            
            <button
              onClick={onGoHome}
              className={`w-full py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-500 transform hover:scale-105 ${
                showResult ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              {t.GO_HOME}
            </button>
          </div>

          {/* 통계 섹션 애니메이션 */}
          <div className={`mt-8 text-center transition-all duration-700 delay-600 ${
            showResult ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">{t.GAME_STATS}</h3>
                <button
                  onClick={resetStats}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-200 transform hover:scale-105"
                  title="통계 초기화"
                >
                  {t.RESET_STATS}
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white rounded p-2 hover:shadow-sm transition-shadow duration-200">
                    <p className="font-semibold text-green-600">{gameStats.wins}</p>
                    <p className="text-xs">{t.WINS}</p>
                  </div>
                  <div className="bg-white rounded p-2 hover:shadow-sm transition-shadow duration-200">
                    <p className="font-semibold text-red-600">{gameStats.losses}</p>
                    <p className="text-xs">{t.LOSSES}</p>
                  </div>
                  <div className="bg-white rounded p-2 hover:shadow-sm transition-shadow duration-200">
                    <p className="font-semibold text-blue-600">{gameStats.totalGames}</p>
                    <p className="text-xs">{t.TOTAL_GAMES}</p>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <p>• {t.WIN_RATE}: <span className="font-semibold">{getWinRate()}</span></p>
                  <p>• {t.CURRENT_STREAK}: <span className="font-semibold">{gameStats.currentStreak}회</span></p>
                  <p>• {t.MAX_STREAK}: <span className="font-semibold">{gameStats.maxStreak}회</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultScreen; 