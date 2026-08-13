import { useState, useCallback, useEffect, useRef } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { sentenceMemoryDefinition } from '.';
import { DifficultyLevel, ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { useManagedTimeout } from "@/hooks/useManagedTimeout";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { sentenceMemoryItems, SentenceMemoryItem } from '../content';
import { pickByDifficulty } from '../contentSelection';
import { sounds } from '@/lib/sounds';

export interface SentenceMemoryConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

// Streak needed to change level, growing with level so higher levels feel
// steadier (e.g. levels 1-3 need 2 in a row, 4-6 need 3, 7-9 need 4).
const streakRequiredFor = (level: DifficultyLevel) => 2 + Math.floor((level - 1) / 3);

export function useSentenceMemoryEngine(config: SentenceMemoryConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  const scheduleTimeout = useManagedTimeout();
  
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
  const recentIdsRef = useRef<string[]>([]);

  const [liveDifficulty, setLiveDifficulty] = useState<DifficultyLevel>(engine.session.currentDifficulty);
  const consecutiveCorrectRef = useRef(0);
  const consecutiveWrongRef = useRef(0);

  const generateNewRound = useCallback(() => {
    const item = pickByDifficulty(sentenceMemoryItems, liveDifficulty, recentIdsRef.current);
    recentIdsRef.current = [...recentIdsRef.current.slice(-2), item.id];
    setCurrentItem(item);
    setPhase('read');

    // Hide sentence after duration based on difficulty (word count * speed factor)
    const wordCount = item.sentence.split(' ').length;
    // e.g. at difficulty 1, 400ms per word. at diff 10, 150ms per word.
    const msPerWord = Math.max(150, 450 - (liveDifficulty * 30));
    const displayTime = wordCount * msPerWord;

    scheduleTimeout(() => {
      setPhase('question');
      setLastShowTime(Date.now());
    }, displayTime);

  }, [liveDifficulty, scheduleTimeout]);

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
      consecutiveWrongRef.current = 0;
      consecutiveCorrectRef.current += 1;

      if (consecutiveCorrectRef.current >= streakRequiredFor(liveDifficulty) && liveDifficulty < 10) {
        consecutiveCorrectRef.current = 0;
        sounds.difficultyChanged();
        setLiveDifficulty(prev => Math.min(10, prev + 1) as DifficultyLevel);
      }
    } else {
      consecutiveCorrectRef.current = 0;
      consecutiveWrongRef.current += 1;

      if (consecutiveWrongRef.current >= streakRequiredFor(liveDifficulty) && liveDifficulty > 1) {
        consecutiveWrongRef.current = 0;
        sounds.difficultyChanged();
        setLiveDifficulty(prev => Math.max(1, prev - 1) as DifficultyLevel);
      }
    }

    // Next item after a short delay
    scheduleTimeout(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }, 500);
    
  }, [engine, isCompleted, phase, currentItem, lastShowTime, generateNewRound, liveDifficulty, scheduleTimeout]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
    setCurrentItem(null);
    setPhase('read');
    setLiveDifficulty(engine.session.currentDifficulty);
    consecutiveCorrectRef.current = 0;
    consecutiveWrongRef.current = 0;
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
