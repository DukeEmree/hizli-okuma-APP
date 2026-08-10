import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { visualSearchDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { wordList } from '../content';

export interface VisualSearchConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useVisualSearchEngine(config: VisualSearchConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [targetWord, setTargetWord] = useState<string>('');
  const [gridWords, setGridWords] = useState<string[]>([]);
  
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

  const engine = useExerciseEngine(visualSearchDefinition, config, handleComplete);

  const generateNewRound = useCallback(() => {
    // Grid size based on difficulty
    const gridSize = Math.min(25, 9 + (engine.session.currentDifficulty * 2)); 
    
    let words: string[] = [];
    while(words.length < gridSize) {
        const w = wordList[Math.floor(Math.random() * wordList.length)];
        if(!words.includes(w)) words.push(w);
    }
    
    const target = words[Math.floor(Math.random() * words.length)];

    setTargetWord(target);
    setGridWords(words);
    setLastShowTime(Date.now());
  }, [engine.session.currentDifficulty]);

  // Initial load
  useEffect(() => {
    if (engine.session.state === 'running' && totalAttempts === 0 && targetWord === '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }
  }, [engine.session.state, totalAttempts, targetWord, generateNewRound]);

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

  const handleSelection = useCallback((word: string) => {
    if (engine.session.state !== 'running' || isCompleted) return;

    const rt = Date.now() - lastShowTime;
    setReactionTimes(prev => [...prev, rt]);
    setTotalAttempts(prev => prev + 1);

    if (word === targetWord) {
        setCorrectCount(prev => prev + 1);
        setTimeout(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
        }, 300);
    }
  }, [engine, isCompleted, targetWord, lastShowTime, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
    setTargetWord('');
  }, [engine]);

  return {
    ...engine,
    reset,
    targetWord,
    gridWords,
    correctCount,
    totalAttempts,
    isCompleted,
    handleSelection,
  };
}
