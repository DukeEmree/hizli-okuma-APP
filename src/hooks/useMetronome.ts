import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useSettingsStore } from '@/stores/settingsStore';

export function useMetronome(defaultBpm?: number) {
  const metronomeEnabled = useSettingsStore(state => state.metronomeEnabled);
  const metronomeBpm = useSettingsStore(state => state.metronomeBpm);
  const setMetronomeBpm = useSettingsStore(state => state.setMetronomeBpm);
  const setMetronomeEnabled = useSettingsStore(state => state.setMetronomeEnabled);
  
  // Use global BPM.
  const bpm = metronomeBpm;
  const isEnabled = metronomeEnabled;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Load the tick sound (ensure the path exists)
  const player = useAudioPlayer(require('@/assets/audio/tick.wav'));

  const playTick = useCallback(() => {
    if (player) {
      player.seekTo(0);
      player.play();
    }
  }, [player]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    if (bpm > 0) {
      const intervalMs = (60 / bpm) * 1000;
      // Play first tick immediately
      playTick();
      timerRef.current = setInterval(() => {
        playTick();
      }, intervalMs);
    }
  }, [bpm, playTick, stopTimer]);

  // Handle play/pause toggle
  useEffect(() => {
    if (isPlaying && isEnabled) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isPlaying, isEnabled, bpm, startTimer, stopTimer]);

  // Handle AppState to stop audio when backgrounded
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current === 'active' && 
        nextAppState.match(/inactive|background/)
      ) {
        // App has gone to the background
        stopTimer();
        setIsPlaying(false);
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [stopTimer]);

  const start = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const stop = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying(prev => !prev), []);

  const toggleEnabled = useCallback(() => {
    setMetronomeEnabled(!isEnabled);
  }, [isEnabled, setMetronomeEnabled]);

  const increaseBpm = useCallback(() => {
    setMetronomeBpm(Math.min(bpm + 10, 600));
  }, [bpm, setMetronomeBpm]);

  const decreaseBpm = useCallback(() => {
    setMetronomeBpm(Math.max(bpm - 10, 30));
  }, [bpm, setMetronomeBpm]);

  return {
    bpm,
    isEnabled,
    isPlaying,
    start,
    pause,
    stop,
    toggle,
    setBpm: setMetronomeBpm,
    toggleEnabled,
    increaseBpm,
    decreaseBpm,
    /** Plays a single tick immediately, independent of the bpm-driven interval. */
    playTick
  };
}
