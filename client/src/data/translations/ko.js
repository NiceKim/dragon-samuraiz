// 한국어 번역
const KO = {
  // 홈 화면
  title: '드래곤 사무라이 Z',
  subtitle: '베거나 베이거나',
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

  // 게임 규칙 팝업
  howToPlay: '게임 방법',
  gameMethod: '게임 방법',
  gameMethodCardText: `드래곤 사무라이 Z는 \n심리 게임입니다.\n카드를 선택해\n적의 공격을 막고,\n 적의 빈틈을 노리세요!`,
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
  slash: '베기',
  parry: '막기',
  focus: '집중',
  slashDescription: "적이 '베기'를 하거나 '방어'하지 않으면 승리합니다. 1의 집중 포인트를 소모합니다.",
  parryDescription: "적의 '베기'를 막습니다. 집중 포인트를 소모하지 않습니다.",
  focusDescription: "집중 포인트를 1 생성합니다.",

  // 게임 화면
  GAME_TITLE: '🎮 드래곤 사무라이 Z',
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
  OPPONENT_DISCONNECTED_REASON: '상대방이 연결을 끊었습니다.',
  powerSlamUse: '비룡일섬 사용하기',
  powerSlam: '비룡일섬',
  powerSlamDescription: "집중 포인트가 3개일 때만 사용할 수 있습니다. 상대가 같은 공격을 하지 않으면 승리 합니다. ",
};

export default KO; 