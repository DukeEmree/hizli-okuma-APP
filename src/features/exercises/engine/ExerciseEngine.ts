import {
  ExerciseDefinition,
  ExerciseConfig,
  ExerciseSession,
  ExerciseResult,
  ExerciseMetrics,
  ExerciseScore,
} from "@/types/exercise";
import { ExerciseTimer } from './ExerciseTimer';
import { calculateExerciseScore, CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

// Generate simple UUID-like string for client session ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export interface EngineCallbacks {
  onStateChange: (session: ExerciseSession) => void;
  onComplete: (result: ExerciseResult) => void;
  onTick?: (elapsedMs: number) => void;
}

export class ExerciseEngine {
  private definition: ExerciseDefinition;
  private config: ExerciseConfig;
  private timer: ExerciseTimer;
  private session: ExerciseSession;
  private callbacks: EngineCallbacks;
  private metrics: ExerciseMetrics = {};

  constructor(
    definition: ExerciseDefinition,
    config: Partial<ExerciseConfig>,
    callbacks: EngineCallbacks
  ) {
    this.definition = definition;
    this.config = { ...definition.defaultConfig, ...config };
    this.callbacks = callbacks;

    this.session = {
      id: generateId(),
      exerciseId: this.definition.id,
      exerciseType: this.definition.type,
      state: 'idle',
      startedAt: null,
      completedAt: null,
      pausedAt: null,
      totalPausedDurationMs: 0,
      currentDifficulty: this.config.initialDifficulty || 1,
      config: this.config,
    };

    this.timer = new ExerciseTimer((ms) => {
      if (this.callbacks.onTick) {
        this.callbacks.onTick(ms);
      }
    }, this.config.updateIntervalMs || 100);
  }

  public getSession() {
    return { ...this.session };
  }

  public updateMetrics(newMetrics: Partial<ExerciseMetrics>) {
    this.metrics = { ...this.metrics, ...newMetrics };
  }

  public start() {
    if (this.session.state !== 'idle' && this.session.state !== 'paused') {
      return;
    }

    if (this.session.state === 'idle') {
      this.session.startedAt = Date.now();
    }

    this.session.state = 'running';
    this.session.pausedAt = null;
    this.timer.start();
    this.callbacks.onStateChange(this.getSession());
  }

  public pause() {
    if (this.session.state !== 'running') return;

    this.timer.pause();
    this.session.state = 'paused';
    this.session.pausedAt = Date.now();
    this.callbacks.onStateChange(this.getSession());
  }

  public resume() {
    this.start();
  }

  public complete() {
    if (this.session.state === 'idle' || this.session.state === 'completed' || this.session.state === 'abandoned') {
      return;
    }

    this.timer.pause();
    this.session.state = 'completed';
    this.session.completedAt = Date.now();
    
    // Resume'dan sonra ne kadar süre paused kaldıysak ekleyebiliriz ama
    // timer getElapsedMs() bu işi çözüyor zaten.
    
    this.callbacks.onStateChange(this.getSession());

    const result = this.calculateResult();
    this.callbacks.onComplete(result);
  }

  public reset() {
    this.timer.reset();
    this.metrics = {};
    this.session = {
      ...this.session,
      id: generateId(),
      state: 'idle',
      startedAt: null,
      completedAt: null,
      pausedAt: null,
      totalPausedDurationMs: 0,
    };
    this.callbacks.onStateChange(this.getSession());
  }

  public cleanup() {
    this.timer.cleanup();
  }

  private calculateScore(): ExerciseScore {
    return calculateExerciseScore(
      this.definition.category,
      this.metrics,
      this.timer.getElapsedMs(),
      this.session.currentDifficulty
    );
  }

  private calculateResult(): ExerciseResult {
    return {
      exerciseId: this.session.exerciseId,
      exerciseType: this.session.exerciseType,
      startedAt: this.session.startedAt || 0,
      completedAt: this.session.completedAt || 0,
      durationMs: this.timer.getElapsedMs(),
      difficulty: this.session.currentDifficulty,
      score: this.calculateScore(),
      metrics: this.metrics,
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    };
  }
}
