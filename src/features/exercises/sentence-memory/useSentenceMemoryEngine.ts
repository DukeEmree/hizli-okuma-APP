import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { sentenceMemoryDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { sentenceMemoryItems, SentenceMemoryItem } from '../content';

export interface SentenceMemoryConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useSentenceMemoryEngine(config: SentenceMemoryConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [currentItem, setCurrentItem] = useState<SentenceMemoryItem | null>(null);
  const [phase, setPhase] = useState<'read' | 'question'>('read');
  
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

  const engine = useExerciseEngine(sentenceMemoryDefinition, config, handleComplete);

  const generateNewRound = useCallback(() => {
    const item = sentenceMemoryItems[Math.floor(Math.random() * sentenceMemoryItems.length)];
    setCurrentItem(item);
    setPhase('read');
    
    // Hide sentence after duration based on difficulty (word count * speed factor)
    const wordCount = item.sentence.split(' ').length;
    // e.g. at difficulty 1, 400ms per word. at diff 10, 150ms per word.
    const msPerWord = Math.max(150, 450 - (engine.session.currentDifficulty * 30));
    const displayTime = wordCount * msPerWord;
    
    setTimeout(() => {
      setPhase('question');
      setLastShowTime(Date.now());
    }, displayTime);
    
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
        reactionTimeMs: reactionTimes,
      });
      engine.complete();
    }
  }, [engine, config.timeLimitMs, isCompleted, correctCount, totalAttempts, reactionTimes]);

  const handleSelection = useCallback((selectedIndex: number) => {
    if (engine.session.state !== 'running' || isCompleted || phase !== 'question' || !currentItem) return;

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
    
  }, [engine, isCompleted, phase, currentItem, lastShowTime, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
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
    handleSelection,
  };
}
