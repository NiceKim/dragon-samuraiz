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
  const carouselCards = [RULE_CARD, ...GAME_CHOICES];

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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t.gameRules}
          </h2>
        </div>

        {/* 카드 Carousel */}
        <div className="flex items-center justify-center mb-6">
          {/* 왼쪽 화살표 */}
          <button
            onClick={prevCard}
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center mr-4 transition duration-200"
          >
            <span className="text-2xl">←</span>
          </button>

          {/* 카드 */}
          <div className="relative w-96 h-[36rem] bg-blood-50 rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            {/* 검은색 뒷배경 */}
            <div className="absolute inset-0 bg-gray-500 z-0"></div>
            {/* blood 색상 배경 */}
            <div className="absolute inset-0 bg-blood-50 z-10"></div>
            {/* 카드 내용 */}
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
              <div className="text-center w-full">
                {currentCardIndex === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-4">
                    <div className="text-3xl font-bold text-white mb-10">{t.gameMethod}</div>
                    <div className="text-2xl font-bold whitespace-pre-line leading-relaxed">
                      {t.gameMethodCardText}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 이모지 또는 이미지 */}
                    <div className="w-60 h-60 mb-4 flex items-center justify-center mx-auto">
                      {currentCard.image ? (
                        <img src={currentCard.image} alt={t[currentCard.key]} className="w-60 h-60 object-contain" />
                      ) : (
                        <div className="text-7xl text-white">{currentCard.emoji}</div>
                      )}
                    </div>
                    {/* 카드 이름 */}
                    <div className="text-3xl font-bold text-white mb-8 px-4 text-center">
                      {t[currentCard.key]}
                    </div>
                    {/* focus point indicator */}
                    {currentCard.key === 'slash' ? (
                      <div className="flex justify-center mt-1">
                        <img src="/image/focus.png" alt="focus" className="w-10 h-10 object-contain" />
                      </div>
                    ) : currentCard.key === 'powerSlam' ? (
                      <div className="flex justify-center mt-1 space-x-1">
                        {[1,2,3].map(n => (
                          <img key={n} src="/image/focus.png" alt="focus" className="w-10 h-10 object-contain" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center mt-1">
                        <div className="w-10 h-10 rounded-full border border-black bg-transparent" />
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
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center ml-4 transition duration-200"
          >
            <span className="text-2xl">→</span>
          </button>
        </div>

        {/* 카드 설명 */}
        {currentCardIndex !== 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t[currentCard.key]} {t.cardDescription}
            </h3>
            <p className="text-gray-700">
              {t[`${currentCard.key}Description`]}
            </p>
          </div>
        )}

        {/* 카드 인디케이터 */}
        <div className="flex justify-center space-x-2 mb-6">
          {carouselCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-3 h-3 rounded-full transition duration-200 ${
                index === currentCardIndex ? 'bg-blood-50' : 'bg-gray-300'
              }`}
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