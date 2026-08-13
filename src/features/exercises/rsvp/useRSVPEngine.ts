import { useEffect, useState, useMemo, useCallback } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { rsvpDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export interface RSVPConfig extends Partial<ExerciseConfig> {
  wpm: number;
  text: string;
  skipDefaultStorage?: boolean;
}

export function useRSVPEngine(config: RSVPConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const storeSession = useCreateSession();
  
  // Metni kelimelere böl (noktalama işaretlerini koru veya temizle ihtiyaca göre)
  const words = useMemo(() => {
    return config.text.trim().split(/\s+/).filter(w => w.length > 0);
  }, [config.text]);

  const msPerWord = useMemo(() => {
    return (60 / config.wpm) * 1000;
  }, [config.wpm]);

  const [wordIndex, setWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = useCallback((result: ExerciseResult) => {
    if (!config.skipDefaultStorage) {
      // Yerel geçmişe kaydet
      storeSession({
        clientSessionId: result.exerciseId + '-' + Date.now(),
        exerciseId: result.exerciseId,
        exerciseType: result.exerciseType,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
        durationMs: result.durationMs,
        difficulty: result.difficulty,
        score: result.score.finalScore,
        metrics: {
          ...result.metrics,
          wpm: config.wpm,
        },
        algorithmVersion: CURRENT_ALGORITHM_VERSION,
      }, result).catch(err => {
        console.error('Failed to store session locally', err);
      });
    }

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [storeSession, config.wpm, config.skipDefaultStorage, onCompleteCallback]);

  const handleTick = useCallback((ms: number) => {
    if (words.length === 0 || isCompleted) return;

    // The last word gets one extra slot held on screen before completing -
    // otherwise it flashes for the same instant as every other word and
    // then is immediately replaced by the results screen, with no beat to
    // actually read it.
    const lastIndex = words.length - 1;
    const completionThresholdMs = words.length * msPerWord + msPerWord;

    if (ms >= completionThresholdMs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
      return;
    }

    const calculatedIndex = Math.min(lastIndex, Math.floor(ms / msPerWord));
    if (calculatedIndex !== wordIndex) {
      setWordIndex(calculatedIndex);
    }
  }, [words.length, isCompleted, msPerWord, wordIndex]);

  const engine = useExerciseEngine(rsvpDefinition, config, handleComplete, handleTick);

  // Maintatin completion logic side effects
  useEffect(() => {
    if (isCompleted && engine.session.state === 'running') {
      engine.updateMetrics({ 
        completionRate: 1, 
        wpm: config.wpm 
      });
      engine.complete();
    }
  }, [isCompleted, engine, config.wpm]);



  const reset = useCallback(() => {
    engine.reset();
    setWordIndex(0);
    setIsCompleted(false);
  }, [engine]);

  return {
    ...engine,
    reset,
    words,
    wordIndex,
    currentWord: words[wordIndex] || '',
    progress: words.length > 0 ? (wordIndex / words.length) : 0,
    isCompleted
  };
}
