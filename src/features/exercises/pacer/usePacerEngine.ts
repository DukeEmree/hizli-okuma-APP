import { useEffect, useState, useMemo, useCallback } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { pacerDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export interface PacerConfig extends Partial<ExerciseConfig> {
  wpm: number;
  text: string;
  highlightMode?: 'word' | 'line';
}

export function usePacerEngine(config: PacerConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const words = useMemo(() => {
    return config.text.trim().split(/\s+/).filter(w => w.length > 0);
  }, [config.text]);

  // Kelime vurgusu için msPerWord
  const msPerWord = useMemo(() => {
    return (60 / config.wpm) * 1000;
  }, [config.wpm]);

  const [highlightIndex, setHighlightIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = useCallback((result: ExerciseResult) => {
    createSession({
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
        highlightMode: config.highlightMode || 'word',
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(console.error);

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [createSession, config.wpm, config.highlightMode, onCompleteCallback]);

  // Highlight index is driven directly from the raw tick `ms`, not the
  // throttled engine.elapsedMs (which only updates ~once/second) - otherwise
  // the word highlight jumps several words at a time instead of advancing
  // word-by-word.
  const handleTick = useCallback((ms: number) => {
    if (words.length === 0 || isCompleted) return;

    // Line modu yerine şimdilik basit 'word' akışına göre ilerliyoruz.
    const calculatedIndex = Math.floor(ms / msPerWord);

    if (calculatedIndex >= words.length) {
      if (!isCompleted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsCompleted(true);
      }
    } else if (calculatedIndex !== highlightIndex) {
      setHighlightIndex(calculatedIndex);
    }
  }, [words.length, isCompleted, msPerWord, highlightIndex]);

  const engine = useExerciseEngine(pacerDefinition, config, handleComplete, handleTick);

  useEffect(() => {
    if (isCompleted && engine.session.state === 'running') {
      engine.updateMetrics({ completionRate: 1, wpm: config.wpm });
      engine.complete();
    }
  }, [isCompleted, engine, config.wpm]);

  const reset = useCallback(() => {
    engine.reset();
    setHighlightIndex(0);
    setIsCompleted(false);
  }, [engine]);

  return {
    ...engine,
    reset,
    words,
    highlightIndex,
    progress: words.length > 0 ? (highlightIndex / words.length) : 0,
    isCompleted
  };
}
