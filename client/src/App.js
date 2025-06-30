import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import HomeScreen from './components/HomeScreen';
import WaitingScreen from './components/WaitingScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import './index.css';

// 프로덕션에서는 같은 서버, 개발에서는 별도 포트
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

// 환경변수 확인용 로그 (개발 시에만)
if (process.env.NODE_ENV === 'development') {
  console.log('환경변수 확인:');
}

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('home'); // home, waiting, game, result
  const [nickname, setNickname] = useState('');
  const [opponent, setOpponent] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showCardReveal, setShowCardReveal] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameTimeout, setGameTimeout] = useState(null);
  const gameResultRef = useRef(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  
  // cardReveal 시점에 받은 데이터들을 저장할 상태들
  const [cardRevealData, setCardRevealData] = useState({
    yourChoice: null,
    opponentChoice: null,
    battleResult: null
  });

  // gameResult가 변경될 때마다 ref 업데이트
  useEffect(() => {
    gameResultRef.current = gameResult;
  }, [gameResult]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('서버에 연결되었습니다.');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('서버와 연결이 끊어졌습니다.');
      setIsConnected(false);
      setGameState('home');
    });

    newSocket.on('waitingForMatch', (data) => {
      console.log('매칭 대기 상태:', data);
      setNickname(data.nickname);
      setGameState('waiting');
    });

    newSocket.on('startGame', (data) => {
      console.log('게임 시작:', data);
      setOpponent(data.opponent);
      setGameState('game');
      setGameStartTime(data.startTime);
      setGameTimeout(data.gameTimeout);
      resetGameStates();
    });

    newSocket.on('gameResult', (data) => {
      console.log('게임 종료 결과:', data);
      setGameResult(data);
      
      // 게임 종료 결과는 즉시 결과창 표시
      console.log('게임 종료 - 결과창 표시');
      setShowResultPopup(true);
    });

    newSocket.on('cardReveal', (data) => {
      console.log('카드 공개 신호 수신:', data);
      setShowCardReveal(true);
      
      // cardReveal에서 받은 모든 데이터를 저장
      setCardRevealData({
        yourChoice: data.yourChoice,
        opponentChoice: data.opponentChoice,
        battleResult: data.battleResult
      });
      
      // 기존 opponentChoice도 업데이트 (하위 호환성)
      if (data && data.opponentChoice) {
        setOpponentChoice(data.opponentChoice);
      }
    });

    newSocket.on('opponentDisconnected', () => {
      console.log('상대방 연결 해제');
      setGameResult({
        result: 'win',
        reason: 'opponent_disconnected'
      });
      setShowResultPopup(true);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // 게임 상태 변경 로그
  useEffect(() => {
    console.log('게임 상태 변경:', gameState, { nickname, opponent });
  }, [gameState, nickname, opponent]);

  const requestMatch = (playerNickname) => {
    console.log('매칭 요청:', playerNickname, { gameState, isConnected });
    
    // 이미 대기 중이거나 게임 중이면 요청하지 않음
    if (gameState === 'waiting' || gameState === 'game') {
      console.log('이미 게임 중이거나 대기 중 - 매칭 요청 무시');
      return;
    }
    
    if (socket && isConnected) {
      socket.emit('requestMatch', { nickname: playerNickname });
      console.log('매칭 요청 전송 완료');
    } else {
      console.error('소켓이 연결되지 않음 - 매칭 요청 실패');
    }
  };

  const sendChoice = (choice) => {
    console.log('App.js - 선택 전송:', choice, { socket: !!socket, isConnected });
    if (socket) {
      socket.emit('choose', { choice });
      console.log('소켓으로 선택 전송 완료');
    } else {
      console.error('소켓이 없어서 선택 전송 실패');
    }
  };

  const goHome = () => {
    console.log('홈으로 이동');
    setGameState('home');
    setNickname('');
    setOpponent('');
    setShowResultPopup(false);
    resetGameStates();
  };

  const requestRematch = () => {
    console.log('재매칭 요청');
    if (socket) {
      socket.emit('requestMatch', { nickname });
    }
    setShowResultPopup(false);
    setGameState('waiting');
    resetGameStates();
  };

  // 공통 게임 상태 초기화 함수
  const resetGameStates = () => {
    setCardRevealData({
      yourChoice: null,
      opponentChoice: null,
      battleResult: null
    });
    setOpponentChoice(null);
    setGameResult(null);
    setShowCardReveal(false);
  };

  const renderScreen = () => {
    console.log('화면 렌더링:', gameState);
    switch (gameState) {
      case 'home':
        return <HomeScreen onStartGame={requestMatch} isConnected={isConnected} />;
      case 'waiting':
        return <WaitingScreen nickname={nickname} />;
      case 'game':
        return (
          <GameScreen 
            nickname={nickname}
            opponent={opponent}
            onChoice={sendChoice}
            socket={socket}
            gameResult={gameResult}
            showCardReveal={showCardReveal}
            gameState={gameState}
            gameStartTime={gameStartTime}
            gameTimeout={gameTimeout}
            opponentChoice={opponentChoice}
            cardRevealData={cardRevealData}
          />
        );
      default:
        return <HomeScreen onStartGame={requestMatch} isConnected={isConnected} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-black">
      {renderScreen()}
      
      {/* 결과 팝업 */}
      {showResultPopup && (
        <ResultScreen 
          result={gameResult}
          onGoHome={goHome}
          onRematch={requestRematch}
        />
      )}
    </div>
  );
}

export default App; 