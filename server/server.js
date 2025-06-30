require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// 게임 규칙 모듈 import
const gameRules = require('./gameRules');

const app = express();
const server = http.createServer(app);

// CORS 설정
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());

// 프로덕션 환경에서 React 빌드 파일 서빙
if (process.env.NODE_ENV === 'production') {
  // 정적 파일 서빙 (캐시 최적화)
  app.use(express.static(path.join(__dirname, '../client/build'), {
    maxAge: '1y', // 1년 캐시
    etag: true,
    lastModified: true
  }));
  
  // 모든 GET 요청을 React 앱으로 라우팅 (SPA 지원)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// 게임 상태 관리
const matchQueue = [];
const activeGames = new Map();
const GAME_TIMEOUT =  10000; // 게임 타임아웃 시간 (10초)
const CARD_REVEAL_DELAY =  3000; // 카드 공개 지연 시간 (5초)

io.on('connection', (socket) => {
  console.log('사용자 연결:', socket.id);

  // 매칭 요청
  socket.on('requestMatch', (data) => {
    const { nickname } = data;
    console.log(`${nickname} 매칭 요청`);
    
    // 이미 매칭 큐에 있는지 확인
    const existingInQueue = matchQueue.find(player => player.socketId === socket.id);
    if (existingInQueue) {
      console.log(`${nickname}이 이미 매칭 큐에 있음 - 요청 무시`);
      return;
    }
    
    // 이미 게임 중인지 확인
    const existingGame = activeGames.get(socket.id);
    if (existingGame) {
      console.log(`${nickname}이 이미 게임 중 - 요청 무시`);
      return;
    }
    
    // 새로운 매칭 요청 추가
    matchQueue.push({ socketId: socket.id, nickname });
    console.log(`매칭 큐에 추가: ${nickname} (총 ${matchQueue.length}명)`);
    
    // 매칭 대기 상태 전송
    socket.emit('waitingForMatch', { nickname: nickname });
    
    // 매칭 시도
    attemptMatch();
  });

  // 게임 선택
  socket.on('choose', (data) => {
    const { choice } = data;
    console.log('서버 - 선택 수신:', { socketId: socket.id, choice });
    
    const game = activeGames.get(socket.id);
    console.log('게임:', { 
      found: !!game, 
      socketId: socket.id,
      gamePlayers: game ? `${game.player1.nickname} vs ${game.player2.nickname}` : 'none'
    });
    
    if (!game) {
      console.error('게임을 찾을 수 없음:', socket.id);
      return;
    }
    
    // 플레이어 선택 저장
    if (game.player1.socketId === socket.id) {
      game.player1.choice = choice;
      console.log('플레이어1 선택 저장:', { nickname: game.player1.nickname, choice });
    } else if (game.player2.socketId === socket.id) {
      game.player2.choice = choice;
      console.log('플레이어2 선택 저장:', { nickname: game.player2.nickname, choice });
    } else {
      console.error('플레이어 식별 실패:', { socketId: socket.id, game });
      return;
    }
    
    // 상대방에게 선택 완료 알림
    const opponentId = game.player1.socketId === socket.id ? game.player2.socketId : game.player1.socketId;
    console.log('상대방에게 선택 완료 알림:', { opponentId, opponentNickname: game.player1.socketId === socket.id ? game.player2.nickname : game.player1.nickname });
    io.to(opponentId).emit('opponentChose');
    
    // 둘 다 선택했는지 확인
    console.log('선택 상태 확인:', { 
      player1Choice: game.player1.choice, 
      player2Choice: game.player2.choice,
      bothChosen: !!(game.player1.choice && game.player2.choice)
    });
    
    if (game.player1.choice && game.player2.choice) {
      console.log('둘 다 선택 완료 - 결과 계산 시작');
      RevealResult(game);
    }
  });

  // 연결 해제
  socket.on('disconnect', () => {
    console.log('사용자 연결 해제:', socket.id);
    
    // 매칭 큐에서 제거
    const queueIndex = matchQueue.findIndex(player => player.socketId === socket.id);
    if (queueIndex !== -1) {
      matchQueue.splice(queueIndex, 1);
    }
    
    // 활성 게임에서 제거
    const game = activeGames.get(socket.id);
    if (game) {
      const opponentId = game.player1.socketId === socket.id ? game.player2.socketId : game.player1.socketId;
      io.to(opponentId).emit('opponentDisconnected');
      activeGames.delete(game.player1.socketId);
      activeGames.delete(game.player2.socketId);
    }
  });
});

// 매칭 시도
function attemptMatch() {
  console.log(`매칭 시도: 큐에 ${matchQueue.length}명 대기 중`);
  
  if (matchQueue.length >= 2) {
    const player1 = matchQueue.shift();
    const player2 = matchQueue.shift();
    
    console.log(`매칭 성공: ${player1.nickname} vs ${player2.nickname}`);
    
    // 게임 생성
    const game = {
      player1: {
        socketId: player1.socketId,
        nickname: player1.nickname,
        choice: null
      },
      player2: {
        socketId: player2.socketId,
        nickname: player2.nickname,
        choice: null
      },
      startTime: Date.now(),
      timeoutId: null // 타임아웃 ID 저장
    };
    
    // 게임 상태 저장
    activeGames.set(player1.socketId, game);
    activeGames.set(player2.socketId, game);
    
    console.log(`게임 생성 완료: ${player1.socketId}, ${player2.socketId}`);
    console.log(`활성 게임 수: ${activeGames.size / 2}`);
    
    // 게임 시작 이벤트 전송
    io.to(player1.socketId).emit('startGame', {
      opponent: player2.nickname,
      startTime: Date.now(),
      gameTimeout: GAME_TIMEOUT
    });
    
    io.to(player2.socketId).emit('startGame', {
      opponent: player1.nickname,
      startTime: Date.now(),
      gameTimeout: GAME_TIMEOUT
    });
    
    console.log(`게임 시작: ${player1.nickname} vs ${player2.nickname}`);
    
    // 게임 타임아웃 설정
    if (game.timeoutId) {
      clearTimeout(game.timeoutId);
    }
    game.timeoutId = setTimeout(() => {
      handleGameTimeout(game);
    }, GAME_TIMEOUT);
  }
}

// 게임 타임아웃 처리
function handleGameTimeout(game) {
  if (!activeGames.has(game.player1.socketId)) return;
  
  const player1Choice = game.player1.choice;
  const player2Choice = game.player2.choice;
  
  console.log('게임 타임아웃 처리:', { 
    player1Choice, 
    player2Choice, 
    game: `${game.player1.nickname} vs ${game.player2.nickname}` 
  });
  
  // 타임아웃 시 선택하지 않은 플레이어의 선택을 null로 설정
  if (!player1Choice) {
    game.player1.choice = null;
  }
  if (!player2Choice) {
    game.player2.choice = null;
  }
  
  // 타임아웃 결과 계산
  let result;
  if (!player1Choice && !player2Choice) {
    // 둘 다 선택하지 않음 - 타임아웃 무승부
    result = 'timeout_draw';
    console.log('타임아웃: 둘 다 선택하지 않음 - 무승부');
  } else if (!player1Choice) {
    // 플레이어1이 선택하지 않음 - 플레이어1 패배
    result = 'lose';
    console.log('타임아웃: 플레이어1 선택하지 않음');
  } else if (!player2Choice) {
    // 플레이어2가 선택하지 않음 - 플레이어1 승리
    result = 'win';
    console.log('타임아웃: 플레이어2 선택하지 않음');
  }

  RevealResult(game, result);
}

// 결과 계산 및 전송
function RevealResult(game, result = null) {
  // 타임아웃 취소
  if (game.timeoutId) {
    clearTimeout(game.timeoutId);
    game.timeoutId = null;
    console.log('게임 종료 - 타임아웃 취소');
  }
  
  const player1Choice = game.player1.choice;
  const player2Choice = game.player2.choice;
  
  // 결과가 전달되지 않은 경우 계산
  if (result === null) {
    result = gameRules.calculateResult(player1Choice, player2Choice);
  }
  
  // 카드 공개 신호 전송 (선택 정보와 대결 결과 포함)
  console.log('카드 공개 신호 전송 시작');
  io.to(game.player1.socketId).emit('cardReveal', {
    yourChoice: player1Choice,
    opponentChoice: player2Choice,
    battleResult: result
  });
  io.to(game.player2.socketId).emit('cardReveal', {
    yourChoice: player2Choice,
    opponentChoice: player1Choice,
    battleResult: result === 'win' ? 'lose' : result === 'lose' ? 'win' : 'draw'
  });
  console.log('카드 공개 신호 전송 완료:', { player1: game.player1.socketId, player2: game.player2.socketId });
  
  // 추가 지연 후 게임 종료 또는 재시작
  setTimeout(() => {
    if (result === 'draw') {
      // 무승부인 경우 게임 상태 초기화 및 재경기 
      game.player1.choice = null;
      game.player2.choice = null;
      game.startTime = Date.now();

      // 새로운 게임 시작 이벤트 전송 (재경기)
      io.to(game.player1.socketId).emit('startGame', {
        opponent: game.player2.nickname,
        startTime: game.startTime,
        gameTimeout: GAME_TIMEOUT
      });
      io.to(game.player2.socketId).emit('startGame', {
        opponent: game.player1.nickname,
        startTime: game.startTime,
        gameTimeout: GAME_TIMEOUT
      });

      // 새로운 타임아웃 설정
      if (game.timeoutId) {
        clearTimeout(game.timeoutId);
      }
      game.timeoutId = setTimeout(() => {
        handleGameTimeout(game);
      }, GAME_TIMEOUT);

      console.log(`무승부 재경기 시작: ${game.player1.nickname} vs ${game.player2.nickname}`);
    } else {
      // 승패가 결정된 경우 또는 타임아웃인 경우 게임 종료 결과 전송 후 게임 종료
      sendGameResult(game, result, player1Choice, player2Choice);
      activeGames.delete(game.player1.socketId);
      activeGames.delete(game.player2.socketId);
      console.log('게임 종료 완료');
    }
  }, CARD_REVEAL_DELAY); // 카드 공개 후 사용자 정의 딜레이 뒤 게임 종료/재시작
}

// 게임 종료 결과 전송 (게임 완전 종료 시점)
function sendGameResult(game, result, player1Choice, player2Choice) {
  // 플레이어1에게 게임 종료 결과 전송
  io.to(game.player1.socketId).emit('gameResult', {
    result: result,
    yourChoice: player1Choice,
    opponentChoice: player2Choice
  });
  
  // 플레이어2에게 게임 종료 결과 전송
  const player2Result = result === 'win' ? 'lose' : result === 'lose' ? 'win' : 'draw';
  io.to(game.player2.socketId).emit('gameResult', {
    result: player2Result,
    yourChoice: player2Choice,
    opponentChoice: player1Choice
  });
  
  console.log(`게임 종료 결과: ${game.player1.nickname} vs ${game.player2.nickname} - ${result}`);
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('프로덕션 모드: React 빌드 파일을 서빙합니다.');
  }
}); 