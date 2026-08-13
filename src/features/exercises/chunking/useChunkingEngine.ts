import { useEffect, useState, useMemo, useCallback } from 'react';
import { useExerciseEngine } from "@/features/exercises/engine/useExerciseEngine";
import { chunkingDefinition } from '.';
import { ExerciseConfig, ExerciseResult } from "@/types/exercise";
import { useCreateSession } from "@/hooks/useCreateSession";
import { CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export interface ChunkingConfig extends Partial<ExerciseConfig> {
  wpm: number;
  text: string;
  chunkSize: number;
  skipDefaultStorage?: boolean;
}

// Groups words into `chunkSize`-word chunks, but never lets a chunk span a
// clause/sentence boundary - a fixed-size sliding window otherwise glues
// the end of one clause to the start of an unrelated next one (e.g. "...
// artırır." + "Gözleriniz her ..."), which reads as two unrelated words
// jammed together even though the source text itself is coherent.
function splitIntoPhraseChunks(text: string, chunkSize: number): string[] {
  const size = Math.max(1, chunkSize);
  const phrases = text.trim().match(/[^,;:.!?…]+[,;:.!?…]*\s*/g) || [text.trim()];
  const chunks: string[] = [];
  for (const phrase of phrases) {
    const words = phrase.trim().split(/\s+/).filter(w => w.length > 0);
    for (let i = 0; i < words.length; i += size) {
      chunks.push(words.slice(i, i + size).join(' '));
    }
  }
  return chunks;
}

export function useChunkingEngine(config: ChunkingConfig, onCompleteCallback?: (result: ExerciseResult) => void) {
  const storeSession = useCreateSession();

  // Kelimeleri chunkSize boyutunda, cümle/madde sınırlarını aşmayacak
  // şekilde birleştirerek grupları (chunk) oluştur
  const chunks = useMemo(() => {
    return splitIntoPhraseChunks(config.text, config.chunkSize);
  }, [config.text, config.chunkSize]);

  // WPM hesabına göre her bir chunk'ın ekranda kalma süresi
  // msPerWord = 60000 / wpm
  // msPerChunk = msPerWord * chunkSize
  const msPerChunk = useMemo(() => {
    const msPerWord = (60 / config.wpm) * 1000;
    return msPerWord * config.chunkSize;
  }, [config.wpm, config.chunkSize]);

  const [chunkIndex, setChunkIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = useCallback((result: ExerciseResult) => {
    if (!config.skipDefaultStorage) {
      storeSession({
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
          wpm: config.wpm,
          chunkSize: config.chunkSize
        },
        algorithmVersion: CURRENT_ALGORITHM_VERSION,
      }, result).catch(err => {
        console.error('Failed to store chunking session locally', err);
      });
    }

    if (onCompleteCallback) {
      onCompleteCallback(result);
    }
  }, [storeSession, config.wpm, config.chunkSize, onCompleteCallback, config.skipDefaultStorage]);

  const engine = useExerciseEngine(chunkingDefinition, config, handleComplete);

  useEffect(() => {
    if (chunks.length === 0 || isCompleted) return;

    const calculatedIndex = Math.floor(engine.elapsedMs / msPerChunk);

    if (calculatedIndex >= chunks.length) {
      if (!isCompleted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCompleted(true);
        engine.updateMetrics({ completionRate: 1, wpm: config.wpm });
        engine.complete();
      }
    } else if (calculatedIndex !== chunkIndex) {
      setChunkIndex(calculatedIndex);
    }
  }, [engine.elapsedMs, msPerChunk, chunks.length, isCompleted, chunkIndex, engine, config.wpm]);

  const reset = useCallback(() => {
    engine.reset();
    setChunkIndex(0);
    setIsCompleted(false);
  }, [engine]);

  return {
    ...engine,
    reset,
    chunks,
    chunkIndex,
    currentChunk: chunks[chunkIndex] || '',
    progress: chunks.length > 0 ? (chunkIndex / chunks.length) : 0,
    isCompleted
  };
}
