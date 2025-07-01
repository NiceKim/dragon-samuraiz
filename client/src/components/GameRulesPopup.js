import React, { useState } from 'react';
import { GAME_CHOICES } from '../data/gameData';
import { TRANSLATIONS } from '../data/translations';

const GameRulesPopup = ({ isOpen, onClose, language }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const t = TRANSLATIONS[language];
  
  // 게임 방법 카드 추가
  const RULE_CARD = {
    key: 'gameMethod',
    emoji: '🎴',
    image: null
  };
  // Focus Point 카드 추가
  const FOCUS_POINT_CARD = {
    key: 'focusPoint',
    emoji: null,
    image: null
  };
  const carouselCards = [RULE_CARD, FOCUS_POINT_CARD, ...GAME_CHOICES];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % carouselCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + carouselCards.length) % carouselCards.length);
  };

  const currentCard = carouselCards[currentCardIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {t.gameRules}
          </h2>
        </div>

        {/* 카드 Carousel */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          {/* 왼쪽 화살표 */}
          <button
            onClick={prevCard}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center mr-2 sm:mr-4 transition duration-200"
          >
            <span className="text-xl sm:text-2xl">←</span>
          </button>

          {/* 카드 */}
          <div className="relative w-[60vw] max-w-[320px] sm:w-[340px] md:w-[380px] lg:w-[420px] aspect-[3/4] bg-blood-50 rounded-xl shadow-2xl border-4 border-gray-500 overflow-hidden flex-shrink-0">
            {/* 카드 내용 */}
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
              <div className="text-center w-full">
                {currentCardIndex === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-2 sm:px-4">
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-6 md:mb-8">{t.gameMethod}</div>
                    <div className="text-sm sm:text-lg md:text-xl font-bold whitespace-pre-line leading-relaxed">
                      {t.gameMethodCardText}
                    </div>
                  </div>
                ) : currentCardIndex === 1 ? (
                  // Focus Point 설명 카드
                  <div className="flex flex-col items-center justify-center h-full px-2 sm:px-4">
                    <div className="flex justify-center items-center mb-4 space-x-2">
                      <img src="/image/focus.png" alt="focus" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-transparent" />
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-transparent" />
                    </div>
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2">{t.focusPoint}</div>
                  </div>
                ) : (
                  <>
                    {/* 이모지 또는 이미지 */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-2 sm:mb-4 flex items-center justify-center mx-auto">
                      {currentCard.image ? (
                        <img src={currentCard.image} alt={t[currentCard.key]} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-3xl sm:text-5xl md:text-6xl text-white">{currentCard.emoji}</div>
                      )}
                    </div>
                    {/* 카드 이름 */}
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 md:mb-6 px-2 sm:px-4 text-center">
                      {t[currentCard.key]}
                    </div>
                    {/* focus point indicator */}
                    {currentCard.key === 'slash' ? (
                      <div className="flex justify-center mt-1">
                        <img src="/image/focus.png" alt="focus" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain" />
                      </div>
                    ) : currentCard.key === 'powerSlam' ? (
                      <div className="flex justify-center mt-1 space-x-1">
                        {[1,2,3].map(n => (
                          <img key={n} src="/image/focus.png" alt="focus" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center mt-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-black bg-transparent" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 화살표 */}
          <button
            onClick={nextCard}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center ml-2 sm:ml-4 transition duration-200"
          >
            <span className="text-xl sm:text-2xl">→</span>
          </button>
        </div>

        {/* 카드 설명 */}
        {currentCardIndex !== 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t[carouselCards[currentCardIndex].key]} {t.cardDescription}
            </h3>
            <p className="text-gray-700">
              {t[`${carouselCards[currentCardIndex].key}Description`]}
            </p>
          </div>
        )}

        {/* 카드 인디케이터 */}
        <div className="flex justify-center space-x-2 mb-6">
          {carouselCards.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 sm:w-6 sm:h-6 rounded-full transition duration-200 ${
                index === currentCardIndex ? 'bg-blood-50' : 'bg-gray-300'
              }`}
              style={{ minWidth: 0, minHeight: 0 }}
            />
          ))}
        </div>

        {/* 닫기 버튼 */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRulesPopup; 