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
  // Each passage carries several questions that are asked back-to-back
  // before a new passage is drawn.
  const [questionIndex, setQuestionIndex] = useState(0);

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
    setQuestionIndex(0);
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

    const question = currentItem.questions[questionIndex];
    if (!question) return;

    setTotalAttempts(prev => prev + 1);

    const isCorrect = selectedIndex === question.correctIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    const hasMoreQuestions = questionIndex + 1 < currentItem.questions.length;

    // Stay on the same passage until all of its questions are answered,
    // then draw a new one.
    setTimeout(() => {
      if (hasMoreQuestions) {
        setQuestionIndex(prev => prev + 1);
      } else {
        generateNewRound();
      }
    }, 500);

    return isCorrect;
  }, [engine, isCompleted, phase, currentItem, questionIndex, generateNewRound]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setCurrentItem(null);
    setQuestionIndex(0);
    setPhase('read');
  }, [engine]);

  return {
    ...engine,
    reset,
    currentItem,
    currentQuestion: currentItem ? currentItem.questions[questionIndex] ?? null : null,
    questionIndex,
    questionCount: currentItem ? currentItem.questions.length : 0,
    phase,
    correctCount,
    totalAttempts,
    isCompleted,
    handleFinishedReading,
    handleSelection,
  };
}
