// 영어 번역
const EN = {
  // 홈 화면
  title: '🐉 Dragon RPS 🐉',
  subtitle: 'Battle other warriors in real-time!',
  connected: 'Server Connected',
  connecting: 'Connecting to server...',
  mute: 'Mute',
  unmute: 'Unmute',
  language: '🌐 Language:',
  nickname: 'Nickname (Optional)',
  nicknamePlaceholder: 'Enter nickname (leave empty for random)',
  nicknameHelp: 'Leave empty to generate a random nickname.',
  startGame: '🎮 Start Game',
  waitingConnection: 'Waiting for connection...',
  gameRules: 'Game Rules',
  rule1: '• Auto-lose if not selected within 30 seconds',
  rule2: '• Auto-win if opponent leaves',
  rule3: '• Standard rock-paper-scissors rules apply',

  // 게임 규칙 팝업
  howToPlay: 'How to Play',
  gameMethod: 'Game Method',
  gameMethodRule: 'Select a card within time limit.\nEach card has a unique rule.',
  gameMethodRule1: '• Select a card within 30 seconds',
  gameMethodRule2: '• Rock beats scissors',
  gameMethodRule3: '• Scissors beat paper',
  gameMethodRule4: '• Paper beats rock',
  cardDescription: 'Description',
  close: 'Close',

  // 대기 화면
  waitingTitle: 'Searching for opponent...',
  waitingNicknameSuffix: '',
  waitingBubbles: ['Matching...', 'Looking for another warrior. Please wait!'],
  waitingTips: [
    '• The game will start automatically when matched',
    '• If no opponent is found, you will keep waiting'
  ],

  // 게임 선택
  rock: 'Rock',
  paper: 'Paper',
  scissors: 'Scissors',
  rockDescription: 'Strong rock that crushes scissors and wins.',
  paperDescription: 'Flexible paper that wraps rock and wins.',
  scissorsDescription: 'Sharp scissors that cut paper and win.',

  // 게임 화면
  GAME_TITLE: '🎮 Rock Paper Scissors',
  MY_CHOICE: 'My Choice',
  OPPONENT_CHOICE: 'Opponent Choice',
  CARD_SELECTION: 'Card Selection',
  SELECT_PLEASE: 'Please select',
  WAITING: 'Waiting...',
  CHOICE_COMPLETE: 'Choice complete!',
  TIMER: 'sec',
  PLAYER: 'Me',
  OPPONENT: 'Opponent',

  // 게임 메시지
  SELECT_CHOICE: 'Please select!',
  WAITING_FOR_OPPONENT: 'Waiting for opponent...',
  OPPONENT_CHOSE: 'Opponent has chosen! Choose quickly!',
  CARD_REVEAL: 'Card reveal!',
  GAME_OVER: 'Game Over',
  CONNECTING: 'Connecting...',
  DISCONNECTED: 'Connection lost.',
  MATCHING: 'Matching...',
  MATCH_FOUND: 'Match found!',
  OPPONENT_DISCONNECTED: 'Opponent disconnected.',
  TIMEOUT: 'Time out',
  REMATCH_REQUEST: 'Requesting rematch...',

  // 결과 화면
  REMATCH: '🔄 Rematch',
  GO_HOME: '🏠 Home',
  GAME_STATS: 'Game Stats',
  RESET_STATS: '🔄 Reset',
  WINS: 'Wins',
  LOSSES: 'Losses',
  DRAWS: 'Draws',
  TOTAL_GAMES: 'Total Games',
  WIN_RATE: 'Win Rate',
  CURRENT_STREAK: 'Current Streak',
  MAX_STREAK: 'Max Streak',

  // 랜덤 닉네임 생성용
  NICKNAME_ADJECTIVES: ['Brave', 'Wise', 'Mighty', 'Swift', 'Clever', 'Mysterious', 'Bold', 'Just'],
  NICKNAME_NOUNS: ['Warrior', 'Samurai', 'Fighter', 'Duelist', 'Wonderer', 'Swordsman', 'Mercenary', 'Ronin'],

  // 게임 결과 텍스트
  WIN_TEXT: '🎉 Victory! 🎉',
  LOSE_TEXT: '😢 Defeat...',
  DRAW_TEXT: '🤝 Draw!',

  // ResultScreen 텍스트
  GAME_RESULT: 'Game Result',
  MY_CHOICE_LABEL: 'My Choice:',
  OPPONENT_CHOICE_LABEL: 'Opponent Choice:',
  NO_CHOICE: 'No Choice',
  TIMEOUT_REASON: 'Result due to timeout.',
  OPPONENT_DISCONNECTED_REASON: 'Opponent disconnected.',

  // 카드 설명
  rockDescription: 'Strong rock that crushes scissors and wins.',
  paperDescription: 'Flexible paper that wraps rock and wins.',
  scissorsDescription: 'Sharp scissors that cut paper and win.'
};

export default EN; 