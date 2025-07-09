/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  GAME_CHOICES, 
  CARD_ANIMATIONS, 
  GAME_CONFIG, 
  STATUS_COLORS,
  STORAGE_KEYS
} from '../data/gameData';
import { TRANSLATIONS, DEFAULT_USER_PREFERENCES } from '../data/translations';
import useAudio from '../hooks/useAudio';

const GameScreen = ({ nickname, opponent, onChoice, socket, gameResult, showCardReveal, gameState, gameStartTime, gameTimeout, opponentChoice: propOpponentChoice, cardRevealData, focusPoint = 1 }) => {
  const [hasChosen, setHasChosen] = useState(false);
  const [opponentChose, setOpponentChose] = useState(false);
  const [uiTimeLeft, setUiTimeLeft] = useState(5); // UI 전용 타이머
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const { playSlashSound, playHitSound, playParrySound, playRoarSound, playFocusSound } = useAudio();
  const soundPlayedRef = useRef(false);
  const [showPowerSlam, setShowPowerSlam] = useState(false);
  const [showPowerSlamFlash, setShowPowerSlamFlash] = useState(false);
  const [fadeOutFlash, setFadeOutFlash] = useState(false);

  // 언어 설정 가져오기
  const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) || DEFAULT_USER_PREFERENCES;
  const language = preferences.language || 'ko';
  const t = TRANSLATIONS[language];

  // cardRevealData가 있으면 카드 선택 정보 업데이트
  useEffect(() => {
    if (cardRevealData && cardRevealData.yourChoice) {
      setSelectedChoice(cardRevealData.yourChoice);
    }
    if (cardRevealData && cardRevealData.opponentChoice) {
      setOpponentChoice(cardRevealData.opponentChoice);
    }
  }, [cardRevealData]);

  // Reveal시 상대방 선택 업데이트 (하위 호환성)
  useEffect(() => {
    if (propOpponentChoice) {
      setOpponentChoice(propOpponentChoice);
    }
  }, [propOpponentChoice]);

  const handleChoice = useCallback((choice) => {
    // 무승부 재경기 중이거나 카드 공개 중이거나 이미 선택한 경우 선택 불가
    const isRematchInProgress = gameResult && gameResult.result === 'draw' && gameResult.reason === 'rematch';
    const canChoose = !hasChosen && !isRematchInProgress;
    
    if (canChoose) {
      setSelectedChoice(choice);
      setHasChosen(true);
      onChoice(choice);
    }
  }, [hasChosen, gameResult, onChoice]);

  // 서버 시간 기반 UI 타이머 계산
  useEffect(() => {
    if (!gameStartTime || !gameTimeout) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const elapsed = now - gameStartTime;
      const remaining = Math.max(0, Math.ceil((gameTimeout - elapsed) / 1000));
      setUiTimeLeft(remaining);
    };

    // 초기 계산
    calculateTimeLeft();

    // 1초마다 업데이트
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [gameStartTime, gameTimeout]);

  // 상대방 선택 소켓 이벤트 리스너
  useEffect(() => {
    if (socket) {
      socket.on('opponentChose', () => {
        console.log('상대방이 선택했습니다');
        setOpponentChose(true);
      });
    }

    return () => {
      if (socket) {
        socket.off('opponentChose');
      }
    };
  }, [socket]);

  // 카드 공개 시 효과음 및 플래시 효과
  useEffect(() => {
    if (showCardReveal && cardRevealData && cardRevealData.battleResult && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      const myCard = cardRevealData.yourChoice || selectedChoice;
      const opponentCard = cardRevealData.opponentChoice;
      if (myCard === 'powerSlam' || opponentCard === 'powerSlam') {
        playRoarSound();
        setShowPowerSlamFlash(true);
        setFadeOutFlash(false);
        const fadeTimer = setTimeout(() => setFadeOutFlash(true), 1500); // 1.5초 후 페이드아웃 시작
        const hideTimer = setTimeout(() => setShowPowerSlamFlash(false), 2000); // 2초 후 완전히 제거
        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(hideTimer);
        };
      }
      switch (cardRevealData.battleResult) {
        case 'win':
          playSlashSound();
          break;
        case 'lose':
          playHitSound();
          break;
        case 'draw':
          if (myCard !== 'focus' && opponentCard !== 'focus') {
            playParrySound();
          }
          else {
            playFocusSound();
          }

          break;
        default:
          break;
      }
    }
  }, [showCardReveal, cardRevealData, playSlashSound, playHitSound, playParrySound, playRoarSound, selectedChoice]);

  // 게임 상태 초기화 (통합)
  useEffect(() => {
    const shouldReset = (gameState === 'game' && !showCardReveal) ||
                       (gameResult && gameResult.result === 'draw' && gameResult.reason === 'rematch');
    
    if (shouldReset) {
      console.log('게임 상태 초기화');
      setHasChosen(false);
      setOpponentChose(false);
      setSelectedChoice(null);
      setOpponentChoice(null);
      soundPlayedRef.current = false; // 효과음 재생 상태 초기화
    }
  }, [gameState, gameResult, showCardReveal]);

  // 집중 포인트가 3이 되는 순간 Power Slam 팝업 띄우기
  useEffect(() => {
    if (focusPoint === 3 && !showPowerSlam && !hasChosen) {
      setShowPowerSlam(true);
    }
  }, [focusPoint, showPowerSlam, hasChosen]);

  const handlePowerSlam = () => {
    setShowPowerSlam(false);
    setSelectedChoice('powerSlam');
    setHasChosen(true);
    onChoice('powerSlam');
  };

  const getStatusMessage = () => {
    if (showCardReveal && cardRevealData && cardRevealData.battleResult) {
      // 카드 공개 상태에서는 결과에 따른 메시지 표시
      switch (cardRevealData.battleResult) {
        case 'win':
          return t.WIN_TEXT;
        case 'lose':
          return t.LOSE_TEXT;
        case 'draw':
          return t.DRAW_TEXT;
        default:
          return t.CHOICE_COMPLETE;
      }
    } else if (hasChosen) {
      return t.CHOICE_COMPLETE;
    } else if (opponentChose) {
      return t.OPPONENT_CHOSE;
    } else {
      return t.SELECT_CHOICE;
    }
  };

  const getStatusColor = () => {
    if (showCardReveal && cardRevealData && cardRevealData.battleResult) {
      // 카드 공개 상태에서는 결과에 따른 색상 표시
      switch (cardRevealData.battleResult) {
        case 'win':
          return 'text-green-600';
        case 'lose':
          return 'text-red-600';
        case 'draw':
          return 'text-yellow-600';
        default:
          return STATUS_COLORS.CHOICE_COMPLETE;
      }
    } else if (hasChosen) {
      return STATUS_COLORS.CHOICE_COMPLETE;
    } else if (opponentChose) {
      return STATUS_COLORS.OPPONENT_CHOSE;
    } else {
      return STATUS_COLORS.DEFAULT;
    }
  };

  const getChoiceDisplay = (choice) => {
    if (!choice) return null;
    
    // choice가 문자열인 경우 (서버에서 받은 선택)
    const choiceKey = typeof choice === 'string' ? choice : choice.key;
    const choiceData = GAME_CHOICES.find(c => c.key === choiceKey);
    
    return choiceData ? { ...choiceData } : null;
  };

  // 게임 카드 컴포넌트
  const GameCard = ({ 
    choice, 
    isRevealed, 
    isWaiting, 
    isOpponent, 
    isSelected, 
    isDisabled, 
    onClick,
    isButton = false
  }) => {
    const choiceData = getChoiceDisplay(choice);
    
    // 스타일 계산
    const base = 'relative rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden transform';
    const size = isButton ? 'w-20 h-28 md:w-24 md:h-36' : 'w-24 h-36 md:w-32 md:h-48';
    const interactive = isButton ? 'cursor-pointer hover:border-blood-100 hover:border-4' : '';
    const selected = isSelected ? 'ring-4 ring-green-300 scale-105' : '';
    
    // 애니메이션 결정 - cardRevealData의 battleResult 사용
    let animation = '';
    if (!isButton && isRevealed && cardRevealData && cardRevealData.battleResult) {
      let cardResult = null;
      
      if (!isOpponent) {
        // 내 카드
        cardResult = cardRevealData.battleResult;
      } else {
        // 상대 카드
        if (cardRevealData.battleResult === 'win') cardResult = 'lose';
        else if (cardRevealData.battleResult === 'lose') cardResult = 'win';
        else cardResult = 'draw';
      }
      
      // 애니메이션 적용
      if (cardResult === 'draw') {
        animation = CARD_ANIMATIONS.DRAW.animation;
      } else if (cardResult === 'win') {
        animation = `${CARD_ANIMATIONS.WINNER.animation} ${CARD_ANIMATIONS.WINNER.scale} ${CARD_ANIMATIONS.WINNER.shadow}`;
      } else if (cardResult === 'lose') {
        animation = 'scale-75 opacity-60';
      }
    }
    
    const cardStyles = `${base} ${size} ${interactive} ${selected} ${animation}`;
    
    // opacity 계산 - cardRevealData의 battleResult 사용
    const opacity = isButton 
      ? (isDisabled && !isSelected) ? 'opacity-50' : 'opacity-100'
      : isRevealed && cardRevealData && cardRevealData.battleResult && cardRevealData.battleResult !== 'draw' && cardRevealData.battleResult !== 'timeout_draw'
        ? (cardRevealData.battleResult === 'win' ? 'opacity-100' : 'opacity-60')
        : 'opacity-100';

    // 렌더링 로직
    const renderButtonContent = () => (
      <>
        <div className="w-8 h-8 md:w-12 md:h-12 mb-1 md:mb-2 flex items-center justify-center">
          {choice?.image ? (
            <img src={choice.image} alt={choice.text} className="w-8 h-8 md:w-12 md:h-12 object-contain" />
          ) : (
            <div className="text-2xl md:text-4xl text-white">{choice?.emoji}</div>
          )}
        </div>
        <div className="text-xs md:text-base font-bold text-white px-1 md:px-2 text-center">
          {t[choice?.key]}
        </div>
        {choice?.key === 'slash' ? (
          <div className="flex justify-center mt-1">
            <img src="/image/focus.png" alt="focus" className="w-3 h-3 md:w-4 md:h-4 object-contain" />
          </div>
        ) : (
          <div className="flex justify-center mt-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-black bg-transparent" />
          </div>
        )}
        {isSelected && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full flex items-center justify-center z-30">
            <span className="text-green-600 text-xs">✓</span>
          </div>
        )}
      </>
    );

    const renderCardContent = () => {
      // 카드 공개 상태일 때
      if (isRevealed) {
        if (choiceData) {
          // 선택 정보가 있으면 실제 선택 표시
          return (
            <>
              <div className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3 flex items-center justify-center mx-auto">
                {choiceData.image ? (
                  <img src={choiceData.image} alt={choiceData.text} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                ) : (
                  <div className="text-3xl md:text-5xl text-white">{choiceData.emoji}</div>
                )}
              </div>
            </>
          );
        } else {
          // 선택 정보가 없으면 (타임아웃 등) 기본 상태 표시
          return (
            <>
              <div className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3 flex items-center justify-center mx-auto">
                <div className="text-2xl md:text-4xl">❓</div>
              </div>
              <div className="text-xs md:text-sm px-1 md:px-2 text-center w-full break-words">
                {isOpponent ? t.WAITING : t.SELECT_PLEASE}
              </div>
            </>
          );
        }
      }
      
      // 카드 공개 전 상태
      if (isWaiting) {
        return (
          <>
            <div className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3 flex items-center justify-center mx-auto">
              <div className="text-2xl md:text-4xl text-gray-600">🥷</div>
            </div>
            <div className="text-sm md:text-lg font-semibold text-gray-800 px-1 md:px-2 text-center w-full break-words">
              {isOpponent ? t.CHOICE_COMPLETE : t.CHOICE_COMPLETE}
            </div>
          </>
        );
      }
      
      // 기본 상태 (선택 전)
      return (
        <>
          <div className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3 flex items-center justify-center mx-auto">
            <div className="text-2xl md:text-4xl">❓</div>
          </div>
          <div className="text-xs md:text-sm px-1 md:px-2 text-center w-full break-words">
            {isOpponent ? t.WAITING : t.SELECT_PLEASE}
          </div>
        </>
      );
    };

    const Component = isButton ? 'button' : 'div';
    const buttonProps = isButton ? { onClick, disabled: isDisabled } : {};

    return (
      <Component {...buttonProps} className={`${cardStyles} ${isButton ? 'card-touch' : ''}`}>
        <div className="absolute inset-0 bg-black z-0" />
        <div className={`absolute inset-0 ${isButton ? 'bg-blood-50' : (isRevealed ? 'bg-blood-50' : (isWaiting && isOpponent ? 'bg-gray-400' : 'bg-white'))} ${opacity} z-10`} />
        <div className="relative z-20 text-center w-full h-full flex flex-col items-center justify-center">
          {isButton ? renderButtonContent() : renderCardContent()}
        </div>
      </Component>
    );
  };

  return (
    <div className="min-h-screen md:min-h-screen h-screen flex justify-center">

      {/* 게임 컨테이너 - 반응형 너비 */}
      <div className="w-full md:w-[555px] h-screen md:min-h-screen flex flex-col bg-white shadow-2xl">
        {/* 상단 헤더 */}
        <div className="bg-white shadow-md p-2 md:p-4">
          <div className="flex justify-between items-center mb-1 md:mb-2">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">{t.GAME_TITLE}</h1>
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-xl md:text-2xl">⏰</span>
              <span className={`text-base md:text-lg font-bold ${uiTimeLeft <= GAME_CONFIG.WARNING_TIME ? 'text-red-600' : 'text-gray-700'}`}>
                {uiTimeLeft}{t.TIMER}
              </span>
            </div>
          </div>
          
          {/* 플레이어 정보 */}
          <div className="flex justify-between items-center text-xs md:text-sm mb-2 md:mb-3">
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs md:text-sm">👤</span>
              </div>
              <span className="font-semibold text-blue-600 truncate max-w-20 md:max-w-none">{nickname}</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="font-semibold text-purple-600 truncate max-w-20 md:max-w-none">{opponent}</span>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs md:text-sm">👤</span>
              </div>
            </div>
          </div>

          {/* 진행 상황 표시 - 상단으로 이동 */}
          <div className="flex justify-center">
            <div className="flex space-x-1 md:space-x-2">
              <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${hasChosen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${opponentChose ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${showCardReveal ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>

        {/* 메인 게임 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 카드 선택 영역 - 좌우 배치 */}
          <div className="flex-1 flex items-center justify-center p-2 md:p-6">
            <div className="w-full max-w-lg">
              {/* 카드 배치 컨테이너 */}
              <div className="flex justify-center items-center mb-3 md:mb-6 space-x-4 md:space-x-8">
                {/* 내 선택 카드 - 좌측 */}
                <div className="text-center">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">{t.MY_CHOICE}</h3>
                  <GameCard 
                    choice={selectedChoice}
                    isMyCard={true}
                    isRevealed={showCardReveal || (hasChosen && selectedChoice)}
                    isWaiting={false}
                    isOpponent={false}
                  />
                </div>

                {/* VS 표시 */}
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-gray-400 mb-1 md:mb-2">VS</div>
                  <div className="w-8 md:w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* 상대 선택 카드 - 우측 */}
                <div className="text-center">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">{t.OPPONENT_CHOICE}</h3>
                  <GameCard 
                    choice={opponentChoice}
                    isMyCard={false}
                    isRevealed={showCardReveal}
                    isWaiting={opponentChose && !showCardReveal}
                    isOpponent={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 상태 메시지 */}
          <div className="px-2 md:px-4 mb-2 md:mb-4">
            <div className={`bg-gray-50 rounded-full py-2 md:py-3 px-4 md:px-6 shadow-md text-center ${getStatusColor()}`}>
              <span className="text-base md:text-lg font-semibold">{getStatusMessage()}</span>
            </div>
          </div>

          {/* 하단 카드 선택 버튼들 */}
          <div className="bg-gray-50 shadow-lg rounded-t-3xl p-3 md:p-6">
            <h3 className="text-center text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">{t.CARD_SELECTION}</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {GAME_CHOICES.filter(choice => choice.key !== 'powerSlam').map((choice) => {
                  const isRematchInProgress = gameResult && gameResult.result === 'draw' && gameResult.reason === 'rematch';
                  const isDisabled = hasChosen || isRematchInProgress || showCardReveal || 
                    (choice.key === 'slash' && focusPoint <= 0);
                  
                  return (
                    <GameCard
                      key={choice.key}
                      choice={choice}
                      isMyCard={true}
                      isRevealed={false}
                      isWaiting={false}
                      isOpponent={false}
                      isSelected={selectedChoice === choice.key}
                      isDisabled={isDisabled}
                      onClick={() => handleChoice(choice.key)}
                      isButton={true}
                    />
                  );
                })}
              </div>
            </div>

            {/* Focus Point UI - 하단으로 이동 */}
            <div className="mt-3 md:mt-6 flex justify-center">
              <div className="flex space-x-2 md:space-x-3">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center`}
                  >
                    {slot <= focusPoint && (
                      <img 
                        src="/image/focus.png" 
                        alt="focus" 
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPowerSlam && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="relative w-80 h-80 md:w-96 md:h-[36rem] bg-blood-50 rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden flex flex-col items-center justify-center">
            {/* 카드 내용 */}
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
              <img src="/image/powerslam.png" alt="Power Slam" className="w-24 h-24 md:w-40 md:h-40 mb-4 md:mb-6" />
              <div className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-white drop-shadow-lg">{t.powerSlam}!</div>
              <div className="flex justify-center items-center mb-6 md:mb-8 space-x-1 md:space-x-2">
                {[1,2,3].map(n => (
                  <img key={n} src="/image/focus.png" alt="focus" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                ))}
              </div>
              <button
                onClick={handlePowerSlam}
                className="px-6 md:px-8 py-3 md:py-4 bg-red-600 hover:bg-red-800 text-white rounded-lg text-lg md:text-xl font-bold shadow-lg transition duration-200 mt-2 md:mt-4"
              >
                {t.powerSlamUse}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPowerSlamFlash && (
        <div className={`fixed inset-0 bg-blood-100 bg-opacity-90 z-[9999] ${fadeOutFlash ? 'animate-fadeout-fast' : ''}`}></div>
      )}
    </div>
  );
};

export default GameScreen; 