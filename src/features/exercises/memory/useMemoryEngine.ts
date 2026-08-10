import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { memoryDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { wordList } from '../content';

export interface MemoryConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useMemoryEngine(config: MemoryConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
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
        errorCount: totalAttempts - correctCount,
        correctCount: correctCount,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(console.error);

    if (onCompleteCallback) onCompleteCallback(result);
  }, [createSession, correctCount, totalAttempts, onCompleteCallback]);

  const engine = useExerciseEngine(memoryDefinition, config, handleComplete);

  const generateNewRound = useCallback(() => {
    // Determine word count based on difficulty (starts at 3)
    const wordCount = Math.min(8, 2 + engine.session.currentDifficulty);
    
    let selectedTargets: string[] = [];
    while (selectedTargets.length < wordCount) {
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      if (!selectedTargets.includes(word)) {
        selectedTargets.push(word);
      }
    }
    
    // Add distractors
    let allOptions = [...selectedTargets];
    while (allOptions.length < wordCount * 2) {
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      if (!allOptions.includes(word)) {
        allOptions.push(word);
      }
    }
    
    setTargetWords(selectedTargets);
    setOptions(allOptions.sort(() => 0.5 - Math.random()));
    setSelectedWords([]);
    setPhase('memorize');
    
    // Hide targets and switch to recall phase
    const displayTime = Math.max(1000, 3000 - (engine.session.currentDifficulty * 200));
    setTimeout(() => {
      setPhase('recall');
    }, displayTime);
    
  }, [engine.session.currentDifficulty]);

  // Initial load
  useEffect(() => {
    if (engine.session.state === 'running' && totalAttempts === 0 && targetWords.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }
  }, [engine.session.state, totalAttempts, targetWords.length, generateNewRound]);

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

  const handleSelection = useCallback((word: string) => {
    if (engine.session.state !== 'running' || isCompleted || phase !== 'recall') return;

    if (selectedWords.includes(word)) return;
    
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    
    if (newSelected.length === targetWords.length) {
      setTotalAttempts(prev => prev + 1);
      
      // Check correctness
      const isCorrect = newSelected.every(w => targetWords.includes(w));
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
      
      // Next round
      setTimeout(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
      }, 1000);
    }
    
  }, [engine, isCompleted, phase, selectedWords, targetWords, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setTargetWords([]);
    setSelectedWords([]);
    setPhase('memorize');
  }, [engine]);

  return {
    ...engine,
    reset,
    targetWords,
    options,
    selectedWords,
    phase,
    correctCount,
    totalAttempts,
    isCompleted,
    handleSelection,
  };
}
