import { useCallback, useRef, useEffect, useMemo } from 'react';
import { STORAGE_KEYS, AUDIO_CONFIG } from '../data/gameData';
import { DEFAULT_USER_PREFERENCES } from '../data/translations';

const useAudio = () => {
  const audioRefs = useRef({});
  const isPreloaded = useRef(false);
  const isMuted = useRef(false);

  // 사용자 설정 가져오기
  const getUserPreferences = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return saved ? JSON.parse(saved) : DEFAULT_USER_PREFERENCES;
  }, []);

  // 사용자 설정 저장하기
  const saveUserPreferences = useCallback((preferences) => {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  }, []);

  // 오디오 파일 목록과 볼륨 설정 (AUDIO_CONFIG 사용)
  const audioFiles = useMemo(() => ({
    [AUDIO_CONFIG.WIN_SOUND]: AUDIO_CONFIG.WIN_VOLUME,
    [AUDIO_CONFIG.LOSE_SOUND]: AUDIO_CONFIG.LOSE_VOLUME,
    [AUDIO_CONFIG.DRAW_SOUND]: AUDIO_CONFIG.DRAW_VOLUME,
    [AUDIO_CONFIG.SLASH_SOUND]: AUDIO_CONFIG.SLASH_VOLUME,
    [AUDIO_CONFIG.HIT_SOUND]: AUDIO_CONFIG.HIT_VOLUME,
    [AUDIO_CONFIG.PARRY_SOUND]: AUDIO_CONFIG.PARRY_VOLUME,
    [AUDIO_CONFIG.ROAR_SOUND]: AUDIO_CONFIG.ROAR_VOLUME
  }), []);

  // 오디오 파일 프리로드 (간단화)
  const preloadAudio = useCallback(() => {
    if (isPreloaded.current) return;
    Object.entries(audioFiles).forEach(([soundName, volume]) => {
      const audio = new window.Audio(`/audio/${soundName}.mp3`);
      audio.volume = volume;
      audio.preload = 'auto';
      audioRefs.current[soundName] = audio;
    });
    isPreloaded.current = true;
  }, [audioFiles]);

  // 컴포넌트 마운트 시 즉시 프리로드
  useEffect(() => {
    preloadAudio();
  }, [preloadAudio]);

  // 음소거 토글
  const toggleMute = useCallback(() => {
    isMuted.current = !isMuted.current;
    console.log('음소거:', isMuted.current ? 'ON' : 'OFF');
    
    // 사용자 설정 업데이트 및 저장
    const preferences = getUserPreferences();
    preferences.audioMuted = isMuted.current;
    saveUserPreferences(preferences);
  }, [getUserPreferences, saveUserPreferences]);

  // 음소거 상태 가져오기
  const getMuteState = useCallback(() => {
    return isMuted.current;
  }, []);

  // 음소거 상태 초기화
  useEffect(() => {
    const preferences = getUserPreferences();
    isMuted.current = preferences.audioMuted;
  }, [getUserPreferences]);

  // 오디오 파일 로드 및 재생 (간단화)
  const playSound = useCallback((soundName, volume = AUDIO_CONFIG.DEFAULT_VOLUME) => {
    if (isMuted.current) return;
    let audio = audioRefs.current[soundName];
    if (!audio) {
      audio = new window.Audio(`/audio/${soundName}.mp3`);
      audio.volume = volume;
      audioRefs.current[soundName] = audio;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  // 게임 결과 사운드 (AUDIO_CONFIG 사용)
  const playWinSound = useCallback(() => {
    playSound(AUDIO_CONFIG.WIN_SOUND, AUDIO_CONFIG.WIN_VOLUME);
  }, [playSound]);

  const playLoseSound = useCallback(() => {
    playSound(AUDIO_CONFIG.LOSE_SOUND, AUDIO_CONFIG.LOSE_VOLUME);
  }, [playSound]);

  const playDrawSound = useCallback(() => {
    playSound(AUDIO_CONFIG.DRAW_SOUND, AUDIO_CONFIG.DRAW_VOLUME);
  }, [playSound]);

  // 카드 공개 효과음 (AUDIO_CONFIG 사용)
  const playSlashSound = useCallback(() => {
    playSound(AUDIO_CONFIG.SLASH_SOUND, AUDIO_CONFIG.SLASH_VOLUME);
  }, [playSound]);

  const playHitSound = useCallback(() => {
    playSound(AUDIO_CONFIG.HIT_SOUND, AUDIO_CONFIG.HIT_VOLUME);
  }, [playSound]);

  const playParrySound = useCallback(() => {
    playSound(AUDIO_CONFIG.PARRY_SOUND, AUDIO_CONFIG.PARRY_VOLUME);
  }, [playSound]);

  const playRoarSound = useCallback(() => {
    playSound('roar', 0.7);
  }, [playSound]);

  return {
    playSound,
    playWinSound,
    playLoseSound,
    playDrawSound,
    playSlashSound,
    playHitSound,
    playParrySound,
    playRoarSound,
    toggleMute,
    getMuteState
  };
};

export default useAudio;
