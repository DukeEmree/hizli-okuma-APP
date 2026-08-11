import { useState, useCallback, useEffect, useRef } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { mainIdeaDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { mainIdeaItems, MainIdeaItem } from '../content';
import { pickByDifficulty } from '../contentSelection';

export interface MainIdeaConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useMainIdeaEngine(config: MainIdeaConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [currentItem, setCurrentItem] = useState<MainIdeaItem | null>(null);
  const [phase, setPhase] = useState<'read' | 'question'>('read');
  
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = useCallback((result: ExerciseResult) => {
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;

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
        errorCount: totalAttempts - correctCount,
        correctCount: correctCount,
        // This is a 'comprehension' category exercise, and both the scoring
        // formula and the adaptive difficulty engine key off
        // `comprehensionAccuracy` (0-1) - without it they fell back to a
        // default "100% accurate" assumption.
        comprehensionAccuracy: accuracy,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(console.error);

    if (onCompleteCallback) onCompleteCallback(result);
  }, [createSession, correctCount, totalAttempts, onCompleteCallback]);

  const engine = useExerciseEngine(mainIdeaDefinition, config, handleComplete);
  const recentIdsRef = useRef<string[]>([]);

  const generateNewRound = useCallback(() => {
    const item = pickByDifficulty(mainIdeaItems, engine.session.currentDifficulty, recentIdsRef.current);
    recentIdsRef.current = [...recentIdsRef.current.slice(-2), item.id];
    setCurrentItem(item);
    setPhase('read');
  }, [engine.session.currentDifficulty]);

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
      });
      engine.complete();
    }
  }, [engine, config.timeLimitMs, isCompleted, correctCount, totalAttempts]);

  const handleFinishedReading = useCallback(() => {
    if (engine.session.state !== 'running' || phase !== 'read') return;
    
    setPhase('question');
  }, [engine.session.state, phase]);

  const handleSelection = useCallback((selectedIndex: number) => {
    if (engine.session.state !== 'running' || isCompleted || phase !== 'question' || !currentItem) return;

    setTotalAttempts(prev => prev + 1);

    if (selectedIndex === currentItem.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Next item after a short delay
    setTimeout(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }, 500);
    
  }, [engine, isCompleted, phase, currentItem, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setCurrentItem(null);
    setPhase('read');
  }, [engine]);

  return {
    ...engine,
    reset,
    currentItem,
    phase,
    correctCount,
    totalAttempts,
    isCompleted,
    handleFinishedReading,
    handleSelection,
  };
}
