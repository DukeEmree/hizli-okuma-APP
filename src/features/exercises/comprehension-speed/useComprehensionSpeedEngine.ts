import { useState, useCallback, useEffect, useRef } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { comprehensionSpeedDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { comprehensionSpeedItems, ComprehensionSpeedItem } from '../content';
import { pickByDifficulty } from '../contentSelection';

export interface ComprehensionSpeedConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useComprehensionSpeedEngine(config: ComprehensionSpeedConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  
  const [currentItem, setCurrentItem] = useState<ComprehensionSpeedItem | null>(null);
  const [phase, setPhase] = useState<'read' | 'questions'>('read');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [readStartTime, setReadStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);

  const handleComplete = useCallback((result: ExerciseResult) => {
    const _accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;

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
        wpm: wpm,
        comprehensionScore: _accuracy * 100,
        // Scoring, adaptive difficulty and the comprehension statistics all
        // read `comprehensionAccuracy` (0-1); sending only the 0-100
        // `comprehensionScore` left this exercise invisible to every one
        // of them.
        comprehensionAccuracy: _accuracy,
        errorCount: totalAttempts - correctCount,
        correctCount: correctCount,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(console.error);

    if (onCompleteCallback) onCompleteCallback(result);
  }, [createSession, correctCount, totalAttempts, wpm, onCompleteCallback]);

  const engine = useExerciseEngine(comprehensionSpeedDefinition, config, handleComplete);
  const recentIdsRef = useRef<string[]>([]);

  const generateNewRound = useCallback(() => {
    const item = pickByDifficulty(comprehensionSpeedItems, engine.session.currentDifficulty, recentIdsRef.current);
    recentIdsRef.current = [...recentIdsRef.current.slice(-2), item.id];
    setCurrentItem(item);
    setPhase('read');
    setCurrentQuestionIndex(0);
    setReadStartTime(Date.now());
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
      engine.updateMetrics({ completionRate: 1 });
      engine.complete();
    }
  }, [engine, config.timeLimitMs, isCompleted]);

  const handleFinishedReading = useCallback(() => {
    if (engine.session.state !== 'running' || phase !== 'read' || !currentItem) return;
    
    const duration = Date.now() - readStartTime;

    const wordCount = currentItem.text.split(' ').length;
    const currentWpm = Math.round((wordCount / duration) * 60000);
    setWpm(currentWpm);
    
    setPhase('questions');
  }, [engine.session.state, phase, readStartTime, currentItem]);

  const handleSelection = useCallback((selectedIndex: number) => {
    if (engine.session.state !== 'running' || isCompleted || phase !== 'questions' || !currentItem) return;

    setTotalAttempts(prev => prev + 1);
    
    const currentQuestion = currentItem.questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
    
    if (currentQuestionIndex < currentItem.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        // Exercise complete
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
        engine.updateMetrics({ completionRate: 1 });
        engine.complete();
    }
    
  }, [engine, isCompleted, phase, currentItem, currentQuestionIndex]);

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsCompleted(false);
    setCurrentItem(null);
    setPhase('read');
    setCurrentQuestionIndex(0);
    setWpm(0);
  }, [engine]);

  return {
    ...engine,
    reset,
    currentItem,
    phase,
    currentQuestionIndex,
    correctCount,
    totalAttempts,
    isCompleted,
    wpm,
    handleFinishedReading,
    handleSelection,
  };
}
