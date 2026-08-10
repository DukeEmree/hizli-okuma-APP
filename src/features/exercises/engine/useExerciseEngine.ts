import { useEffect, useRef, useState, useCallback } from 'react';
import { ExerciseEngine, EngineCallbacks } from './ExerciseEngine';
import { ExerciseDefinition, ExerciseConfig, ExerciseSession, ExerciseMetrics } from "@/types/exercise";
import { analytics } from "@/lib/analytics";

export function useExerciseEngine(
  definition: ExerciseDefinition,
  config: Partial<ExerciseConfig> = {},
  onCompleteCallback?: EngineCallbacks['onComplete'],
  onTickCallback?: EngineCallbacks['onTick']
) {
  const [session, setSession] = useState<ExerciseSession | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const statusRef = useRef<string | null>(null);
  const lastRenderedMs = useRef(0);

  // The engine instance is created once (below) and its callbacks close over
  // these refs rather than the onCompleteCallback/onTickCallback params
  // directly - the params are updated on every render, but the engine's
  // callback closures are not, so reading the params directly would freeze
  // them to whatever was passed on the first render.
  const onCompleteRef = useRef(onCompleteCallback);
  const onTickRef = useRef(onTickCallback);
  useEffect(() => {
    onCompleteRef.current = onCompleteCallback;
    onTickRef.current = onTickCallback;
  });

  // eslint-disable-next-line react-hooks/refs
  const [engine] = useState(() => new ExerciseEngine(definition, config, {
    onStateChange: (newSession) => {
      setSession(newSession);
      if (newSession.state === 'running' && statusRef.current !== 'running') {
        analytics.track('exercise_started', { exerciseType: definition.type, difficulty: config.difficulty });
      }
      statusRef.current = newSession.state;
    },
    onComplete: (result) => {
      analytics.track('exercise_completed', { exerciseType: definition.type });
      onCompleteRef.current?.(result);
    },
    onTick: (ms) => {
      onTickRef.current?.(ms);
      // Throttle React state updates to ~1000ms (1 second) to prevent UI thread blocking
      if (ms - lastRenderedMs.current >= 1000) {
        lastRenderedMs.current = ms;
        setElapsedMs(ms);
      }
    },
  }));

  useEffect(() => {
    // Component mount olduğunda başlangıç state'ini al
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(engine.getSession());
    
    return () => {
      engine.cleanup();
    };
  }, [engine]);

  const start = useCallback(() => engine.start(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const resume = useCallback(() => engine.resume(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);
  const complete = useCallback(() => engine.complete(), [engine]);
  
  const updateMetrics = useCallback(
    (metrics: Partial<ExerciseMetrics>) => engine.updateMetrics(metrics),
    [engine]
  );

  // Track abandoned exercise if unmounted while running
  useEffect(() => {
    return () => {
      if (statusRef.current === 'running' || statusRef.current === 'paused') {
        analytics.track('exercise_abandoned', { exerciseType: definition.type });
      }
    };
  }, [definition.type]);

  return {
    session: session || engine.getSession(),
    elapsedMs,
    start,
    pause,
    resume,
    reset,
    complete,
    updateMetrics,
  };
}
