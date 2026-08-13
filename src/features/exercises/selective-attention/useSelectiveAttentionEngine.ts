import { useState, useCallback, useEffect } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { selectiveAttentionDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { useManagedTimeout } from "@/hooks/useManagedTimeout";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { categoryWords } from '../content';

export interface SelectiveAttentionConfig extends Partial<ExerciseConfig> {
  timeLimitMs: number;
}

export function useSelectiveAttentionEngine(config: SelectiveAttentionConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const createSession = useCreateSession();
  const scheduleTimeout = useManagedTimeout();
  
  const [targetCategory, setTargetCategory] = useState<keyof typeof categoryWords>('animals');
  const [gridWords, setGridWords] = useState<string[]>([]);
  const [correctWordsInGrid, setCorrectWordsInGrid] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [round, setRound] = useState(0);

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
        errorCount: errorCount,
        correctCount: correctCount,
      },
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    }, result).catch(console.error);

    if (onCompleteCallback) onCompleteCallback(result);
  }, [createSession, correctCount, errorCount, onCompleteCallback]);

  const engine = useExerciseEngine(selectiveAttentionDefinition, config, handleComplete);

  const generateNewRound = useCallback(() => {
    const categories: (keyof typeof categoryWords)[] = ['animals', 'fruits', 'colors', 'objects'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Grid size based on difficulty
    const gridSize = Math.min(25, 9 + (engine.session.currentDifficulty * 2)); // 9 to 25 items
    
    // Determine how many correct items to put in grid
    const numCorrect = Math.min(5, 2 + Math.floor(engine.session.currentDifficulty / 2));
    
    let correctItems: string[] = [];
    const categoryArray = categoryWords[selectedCategory];
    while(correctItems.length < numCorrect) {
        const item = categoryArray[Math.floor(Math.random() * categoryArray.length)];
        if(!correctItems.includes(item)) correctItems.push(item);
    }

    let distractorItems: string[] = [];
    const otherCategories = categories.filter(c => c !== selectedCategory);
    while(distractorItems.length < (gridSize - numCorrect)) {
        const c = otherCategories[Math.floor(Math.random() * otherCategories.length)];
        const item = categoryWords[c][Math.floor(Math.random() * categoryWords[c].length)];
        if(!distractorItems.includes(item) && !correctItems.includes(item)) {
            distractorItems.push(item);
        }
    }

    const allItems = [...correctItems, ...distractorItems].sort(() => 0.5 - Math.random());

    setTargetCategory(selectedCategory);
    setGridWords(allItems);
    setCorrectWordsInGrid(correctItems);
    setSelectedWords([]);
    setRound(prev => prev + 1);
  }, [engine.session.currentDifficulty]);

  // Initial load
  useEffect(() => {
    if (engine.session.state === 'running' && round === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
    }
  }, [engine.session.state, round, generateNewRound]);

  // Time limit check
  useEffect(() => {
    if (!isCompleted && engine.elapsedMs >= config.timeLimitMs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
      engine.updateMetrics({
        completionRate: 1,
        correctCount,
        errorCount,
      });
      engine.complete();
    }
  }, [engine, config.timeLimitMs, isCompleted, correctCount, errorCount]);

  const handleSelection = useCallback((word: string) => {
    if (engine.session.state !== 'running' || isCompleted) return;

    if (selectedWords.includes(word)) return;
    
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    if (correctWordsInGrid.includes(word)) {
        setCorrectCount(prev => prev + 1);
        
        // Check if all correct words are found
        const foundAll = correctWordsInGrid.every(w => newSelected.includes(w));
        if (foundAll) {
            scheduleTimeout(() => {
                // eslint-disable-next-line react-hooks/set-state-in-effect
      generateNewRound();
            }, 500);
        }
    } else {
        setErrorCount(prev => prev + 1);
    }
    
  }, [engine, isCompleted, selectedWords, correctWordsInGrid, generateNewRound, scheduleTimeout]);

  const getCategoryName = (cat: keyof typeof categoryWords) => {
      switch(cat) {
          case 'animals': return 'Hayvanlar';
          case 'fruits': return 'Meyveler';
          case 'colors': return 'Renkler';
          case 'objects': return 'Eşyalar';
          default: return cat;
      }
  }

  const reset = useCallback(() => {
    engine.reset();
    setCorrectCount(0);
    setErrorCount(0);
    setIsCompleted(false);
    setSelectedWords([]);
    setRound(0);
  }, [engine]);

  return {
    ...engine,
    reset,
    targetCategoryName: getCategoryName(targetCategory),
    gridWords,
    selectedWords,
    correctWordsInGrid,
    correctCount,
    errorCount,
    isCompleted,
    handleSelection,
  };
}
