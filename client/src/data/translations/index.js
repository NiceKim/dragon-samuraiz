import KO from './ko';
import EN from './en';

// 다국어 번역 통합
export const TRANSLATIONS = {
  ko: KO,
  en: EN
};

// 지원 언어
export const SUPPORTED_LANGUAGES = {
  ko: '한국어',
  en: 'English'
};

// 기본 사용자 설정
export const DEFAULT_USER_PREFERENCES = {
  audioMuted: false,
  language: 'en' // 'ko', 'en'
};

export default TRANSLATIONS; 