// 한국어 번역
const KO = {
  // 홈 화면
  title: '🐉 용사 가위바위보 🐉',
  subtitle: '실시간으로 다른 용사와 대결하세요!',
  connected: '서버 연결됨',
  connecting: '서버 연결 중...',
  mute: '음소거',
  unmute: '음소거 해제',
  language: '🌐 언어:',
  nickname: '닉네임 (선택사항)',
  nicknamePlaceholder: '닉네임을 입력하세요 (비워두면 랜덤 생성)',
  nicknameHelp: '비워두시면 자동으로 랜덤 닉네임이 생성됩니다.',
  startGame: '🎮 게임 시작',
  waitingConnection: '연결 대기 중...',
  gameRules: '게임 규칙',
  rule1: '• 30초 내에 선택하지 않으면 자동 패배',
  rule2: '• 상대방이 나가면 자동 승리',
  rule3: '• 가위바위보 기본 규칙 적용',

  // 게임 규칙 팝업
  howToPlay: '게임 방법',
  gameMethod: '게임 방법',
  gameMethodRule: '시간 제한 내에 카드를 선택하세요.\n각 카드는 고유한 규칙을 가지고 있습니다.',
  cardDescription: '설명',
  close: '닫기',

  // 대기 화면
  waitingTitle: '상대방을 찾는 중...',
  waitingNicknameSuffix: '님',
  waitingBubbles: ['매칭 중...', '다른 용사를 찾고 있습니다. 잠시만 기다려주세요!'],
  waitingTips: [
    '• 매칭이 완료되면 자동으로 게임이 시작됩니다',
    '• 상대방이 없으면 계속 대기합니다'
  ],

  // 게임 선택
  rock: '바위',
  paper: '보',
  scissors: '가위',
  rockDescription: '강력한 바위로 가위를 부수고 승리합니다.',
  paperDescription: '유연한 보로 바위를 감싸고 승리합니다.',
  scissorsDescription: '날카로운 가위로 보를 자르고 승리합니다.',

  // 게임 화면
  GAME_TITLE: '🎮 가위바위보',
  MY_CHOICE: '내 선택',
  OPPONENT_CHOICE: '상대 선택',
  CARD_SELECTION: '카드 선택',
  SELECT_PLEASE: '선택해주세요',
  WAITING: '대기 중...',
  CHOICE_COMPLETE: '선택 완료!',
  TIMER: '초',
  PLAYER: '나',
  OPPONENT: '상대',

  // 게임 메시지
  SELECT_CHOICE: '선택해주세요!',
  WAITING_FOR_OPPONENT: '상대방을 기다리는 중...',
  OPPONENT_CHOSE: '상대방이 선택했습니다! 빨리 선택하세요!',
  CARD_REVEAL: '카드 공개!',
  GAME_OVER: '게임 종료',
  CONNECTING: '연결 중...',
  DISCONNECTED: '연결이 끊어졌습니다.',
  MATCHING: '매칭 중...',
  MATCH_FOUND: '매칭 완료!',
  OPPONENT_DISCONNECTED: '상대방이 연결을 끊었습니다.',
  TIMEOUT: '시간 초과',
  REMATCH_REQUEST: '재매칭 요청 중...',

  // 결과 화면
  REMATCH: '🔄 다시 매칭',
  GO_HOME: '🏠 홈으로',
  GAME_STATS: '게임 통계',
  RESET_STATS: '🔄 초기화',
  WINS: '승리',
  LOSSES: '패배',
  DRAWS: '무승부',
  TOTAL_GAMES: '총 게임',
  WIN_RATE: '승률',
  CURRENT_STREAK: '현재 연승',
  MAX_STREAK: '최고 연승',

  // 랜덤 닉네임 생성용
  NICKNAME_ADJECTIVES: ['용감한', '지혜로운', '강력한', '빠른', '영리한', '신비로운', '대담한', '정의로운'],
  NICKNAME_NOUNS: ['사무라이', '검객', '방랑자', '무사', '검사', '전사', '결투가', '협객', '한량'],

  // 게임 결과 텍스트
  WIN_TEXT: '🎉 승리! 🎉',
  LOSE_TEXT: '😢 패배...',
  DRAW_TEXT: '🤝 무승부!',

  // ResultScreen 텍스트
  GAME_RESULT: '게임 결과',
  MY_CHOICE_LABEL: '내 선택:',
  OPPONENT_CHOICE_LABEL: '상대 선택:',
  NO_CHOICE: '선택 안함',
  TIMEOUT_REASON: '시간 초과로 인한 결과입니다.',
  OPPONENT_DISCONNECTED_REASON: '상대방이 연결을 끊었습니다.'
};

export default KO; 