import { useEffect, useState, useCallback } from 'react';
import { ExerciseTimer } from './ExerciseTimer';

export function useExerciseTimer(updateIntervalMs = 100) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer nesnesini state içinde bir kez oluşturuyoruz
  const [timer] = useState(() => new ExerciseTimer((ms) => {
    setElapsedMs(ms);
  }, updateIntervalMs));

  // Unmount durumunda cleanup çağrılıyor, memory leak önleniyor
  useEffect(() => {
    return () => {
      timer.cleanup();
    };
  }, [timer]);

  const start = useCallback(() => {
    timer.start();
    setIsRunning(true);
  }, [timer]);

  const pause = useCallback(() => {
    timer.pause();
    setIsRunning(false);
  }, [timer]);

  const reset = useCallback(() => {
    timer.reset();
    setElapsedMs(0);
    setIsRunning(false);
  }, [timer]);

  return {
    elapsedMs,
    isRunning,
    start,
    pause,
    reset,
  };
}
