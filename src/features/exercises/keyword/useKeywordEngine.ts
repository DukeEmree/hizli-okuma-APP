import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { keywordDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { keywordItems, KeywordItem } from '../content';

export interface KeywordConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useKeywordEngine(config: KeywordConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [currentItem, setCurrentItem] = useState<KeywordItem | null>(null);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastShowTime, setLastShowTime] = useState(0);

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
        reactionTimeMs: reactionTimes,
        errorCount: totalAttempts - correctCount,
        correctCount: correctCount,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(console.error);

    if (onCompleteCallback) onCompleteCallback(result);
  }, [createSession, correctCount, totalAttempts, reactionTimes, onCompleteCallback]);

  const engine = useExerciseEngine(keywordDefinition, config, handleComplete);

  const generateNewRound = useCallback(() => {
    const item = keywordItems[Math.floor(Math.random() * keywordItems.length)];
    setCurrentItem(item);
    setLastShowTime(Date.now());
  }, []);

  // Initial load
  useEffect(() => {
    if (engine.session.state === 'running' && totalAttempts === 0 && !currentItem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }
  }, [engine.session.state, totalAttempts, currentItem, generateNewRound]);

  // Time limit check
  useEffect(() => {
    if (!isCompleted && engine.elapsedMs >= config.timeLimitMs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
      engine.updateMetrics({
        completionRate: 1,
        correctCount,
        errorCount: totalAttempts - correctCount,
        reactionTimeMs: reactionTimes,
      });
      engine.complete();
    }
  }, [engine, config.timeLimitMs, isCompleted, correctCount, totalAttempts, reactionTimes]);

  const handleSelection = useCallback((selectedIndex: number) => {
    if (engine.session.state !== 'running' || isCompleted || !currentItem) return;

    const rt = Date.now() - lastShowTime;
    setReactionTimes(prev => [...prev, rt]);
    setTotalAttempts(prev => prev + 1);

    if (selectedIndex === currentItem.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Next item after a short delay
    setTimeout(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }, 500);
    
  }, [engine, isCompleted, currentItem, lastShowTime, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
    setCurrentItem(null);
  }, [engine]);

  return {
    ...engine,
    reset,
    currentItem,
    correctCount,
    totalAttempts,
    isCompleted,
    handleSelection,
  };
}
