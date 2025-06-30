import { TRANSLATIONS, SUPPORTED_LANGUAGES, DEFAULT_USER_PREFERENCES } from './translations';

// 게임 선택 옵션
export const GAME_CHOICES = [
  {
    key: 'slash',
    image: '/image/slash.png',
    text: 'Slash',
  },
  {
    key: 'parry',
    image: '/image/parry.png',
    text: 'Parry',
  },
  {
    key: 'focus',
    image: '/image/focus.png',
    text: 'Focus',
  },
  {
    key: 'powerSlam',
    image: '/image/powerslam.png',
    text: 'Power Slam',
  },
];

// 카드 애니메이션 설정
export const CARD_ANIMATIONS = {
  WINNER: {
    scale: 'scale-110',
    animation: 'animate-winCard',
    shadow: 'shadow-2xl'
  },
  DRAW: {
    animation: 'animate-pulse'
  }
};

// 게임 설정
export const GAME_CONFIG = {
  WARNING_TIME: 3
};

// 상태 색상
export const STATUS_COLORS = {
  CARD_REVEAL: 'text-purple-600',
  CHOICE_COMPLETE: 'text-green-600',
  OPPONENT_CHOSE: 'text-yellow-600',
  DEFAULT: 'text-gray-600'
};

// 기본 통계 데이터
export const DEFAULT_STATS = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastResult: null
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  GAME_STATS: 'rpsGameStats',
  USER_PREFERENCES: 'rpsUserPreferences'
};

// 오디오 설정
export const AUDIO_CONFIG = {
  WIN_SOUND: 'win',
  LOSE_SOUND: 'lose', 
  DRAW_SOUND: 'lose', // 무승부로 게임 끝나면 패배 효과음
  SLASH_SOUND: 'slash',
  HIT_SOUND: 'hit',
  PARRY_SOUND: 'parry',
  ROAR_SOUND: 'roar',
  DEFAULT_VOLUME: 0.5,
  WIN_VOLUME: 0.6,
  LOSE_VOLUME: 0.6,
  DRAW_VOLUME: 0.4,
  SLASH_VOLUME: 0.7,
  HIT_VOLUME: 0.7,
  PARRY_VOLUME: 0.5,
  ROAR_VOLUME: 0.7
};

// 번역 관련 export
export { TRANSLATIONS, SUPPORTED_LANGUAGES, DEFAULT_USER_PREFERENCES };
