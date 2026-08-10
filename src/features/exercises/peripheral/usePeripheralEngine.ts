import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { peripheralDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { wordList } from '../content';

export interface PeripheralConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
  updateIntervalMs: number;
}

export function usePeripheralEngine(config: PeripheralConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');
  const [distance, setDistance] = useState<number>(100); // Distance from center
  const [showTarget, setShowTarget] = useState(false);
  
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

  const engine = useExerciseEngine(peripheralDefinition, config, handleComplete);

  const generateNewTarget = useCallback(() => {
    const targetIdx = Math.floor(Math.random() * wordList.length);
    const target = wordList[targetIdx];
    
    // Choose 3 false options
    let falseOptions: string[] = [];
    while (falseOptions.length < 3) {
      const opt = wordList[Math.floor(Math.random() * wordList.length)];
      if (opt !== target && !falseOptions.includes(opt)) {
        falseOptions.push(opt);
      }
    }
    
    const allOptions = [...falseOptions, target].sort(() => 0.5 - Math.random());
    const positions: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'right', 'top', 'bottom'];
    
    setCurrentTarget(target);
    setOptions(allOptions);
    setPosition(positions[Math.floor(Math.random() * positions.length)]);
    setDistance(100 + (engine.session.currentDifficulty * 10)); // Adaptive distance
    
    setShowTarget(true);
    setLastShowTime(Date.now());
    
    // Hide target after a short duration based on difficulty
    const hideDuration = Math.max(200, 1000 - (engine.session.currentDifficulty * 80));
    setTimeout(() => {
      setShowTarget(false);
    }, hideDuration);
    
  }, [engine.session.currentDifficulty]);

  // Initial load
  useEffect(() => {
    if (engine.session.state === 'running' && totalAttempts === 0 && !currentTarget) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewTarget();
    }
  }, [engine.session.state, totalAttempts, currentTarget, generateNewTarget]);

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

  const handleSelection = useCallback((selectedWord: string) => {
    if (engine.session.state !== 'running' || isCompleted) return;

    const rt = Date.now() - lastShowTime;
    setReactionTimes(prev => [...prev, rt]);
    setTotalAttempts(prev => prev + 1);

    if (selectedWord === currentTarget) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Next item after a short delay
    setTimeout(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewTarget();
    }, 500);
    
  }, [engine, isCompleted, currentTarget, lastShowTime, generateNewTarget]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
    setCurrentTarget('');
  }, [engine]);

  return {
    ...engine,
    reset,
    currentTarget,
    options,
    position,
    distance,
    showTarget,
    correctCount,
    totalAttempts,
    isCompleted,
    handleSelection,
  };
}
