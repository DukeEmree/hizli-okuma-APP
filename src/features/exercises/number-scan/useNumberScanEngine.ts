import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { numberScanDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export interface NumberScanConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useNumberScanEngine(config: NumberScanConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [gridNumbers, setGridNumbers] = useState<number[]>([]);
  
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

  const engine = useExerciseEngine(numberScanDefinition, config, handleComplete);

  const generateNewRound = useCallback(() => {
    // Grid size based on difficulty (3x3 up to 6x6 max initially, or generic amount)
    const gridSize = Math.min(36, 9 + (engine.session.currentDifficulty * 3)); 
    
    // Generate numbers (e.g., 2 or 3 digit numbers depending on difficulty)
    const minVal = engine.session.currentDifficulty > 5 ? 100 : 10;
    const maxVal = engine.session.currentDifficulty > 5 ? 999 : 99;

    let numbers: number[] = [];
    while(numbers.length < gridSize) {
        const n = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        if(!numbers.includes(n)) numbers.push(n);
    }
    
    const target = numbers[Math.floor(Math.random() * numbers.length)];

    setTargetNumber(target);
    setGridNumbers(numbers);
    setLastShowTime(Date.now());
  }, [engine.session.currentDifficulty]);

  // Initial load
  useEffect(() => {
    if (engine.session.state === 'running' && totalAttempts === 0 && targetNumber === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }
  }, [engine.session.state, totalAttempts, targetNumber, generateNewRound]);

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

  const handleSelection = useCallback((number: number) => {
    if (engine.session.state !== 'running' || isCompleted) return;

    const rt = Date.now() - lastShowTime;
    setReactionTimes(prev => [...prev, rt]);
    setTotalAttempts(prev => prev + 1);

    if (number === targetNumber) {
        setCorrectCount(prev => prev + 1);
        setTimeout(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
        }, 300);
    }
  }, [engine, isCompleted, targetNumber, lastShowTime, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
    setTargetNumber(0);
  }, [engine]);

  return {
    ...engine,
    reset,
    targetNumber,
    gridNumbers,
    correctCount,
    totalAttempts,
    isCompleted,
    handleSelection,
  };
}
