import { useState, useCallback, useEffect, useRef } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { keywordDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { useManagedTimeout } from "@/hooks/useManagedTimeout";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { keywordItems, KeywordItem } from '../content';
import { pickByDifficulty } from '../contentSelection';

export interface KeywordConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useKeywordEngine(config: KeywordConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  const scheduleTimeout = useManagedTimeout();
  
  const [currentItem, setCurrentItem] = useState<KeywordItem | null>(null);
  // Each passage carries several questions that are asked back-to-back
  // before a new passage is drawn.
  const [questionIndex, setQuestionIndex] = useState(0);

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
  const recentIdsRef = useRef<string[]>([]);

  const generateNewRound = useCallback(() => {
    const item = pickByDifficulty(keywordItems, engine.session.currentDifficulty, recentIdsRef.current);
    recentIdsRef.current = [...recentIdsRef.current.slice(-2), item.id];
    setCurrentItem(item);
    setQuestionIndex(0);
    setLastShowTime(Date.now());
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
    if (engine.session.state !== 'running' || isCompleted || !currentItem) return;

    const question = currentItem.questions[questionIndex];
    if (!question) return;

    const rt = Date.now() - lastShowTime;
    setReactionTimes(prev => [...prev, rt]);
    setTotalAttempts(prev => prev + 1);

    if (selectedIndex === question.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }

    const hasMoreQuestions = questionIndex + 1 < currentItem.questions.length;

    // Stay on the same passage until all of its questions are answered,
    // then draw a new one.
    scheduleTimeout(() => {
      if (hasMoreQuestions) {
        setQuestionIndex(prev => prev + 1);
        setLastShowTime(Date.now());
      } else {
        generateNewRound();
      }
    }, 500);

  }, [engine, isCompleted, currentItem, questionIndex, lastShowTime, generateNewRound, scheduleTimeout]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setReactionTimes([]);
    setCurrentItem(null);
    setQuestionIndex(0);
  }, [engine]);

  return {
    ...engine,
    reset,
    currentItem,
    currentQuestion: currentItem ? currentItem.questions[questionIndex] ?? null : null,
    questionIndex,
    questionCount: currentItem ? currentItem.questions.length : 0,
    correctCount,
    totalAttempts,
    isCompleted,
    handleSelection,
  };
}
