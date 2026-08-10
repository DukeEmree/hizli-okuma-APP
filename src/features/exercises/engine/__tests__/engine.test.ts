// @ts-ignore
import { expect, test, describe, mock } from 'bun:test';
import { ExerciseEngine } from "@/features/exercises/engine/ExerciseEngine";
import { ExerciseDefinition } from "@/types/exercise";

const mockDefinition: ExerciseDefinition = {
  id: 'test-exercise',
  type: 'test',
  category: 'reading',
  nameKey: 'test.name',
  descriptionKey: 'test.desc',
  defaultConfig: { initialDifficulty: 1 }
};

describe('ExerciseEngine', () => {
  test('should start and change state to running', () => {
    const onStateChange = mock();
    const engine = new ExerciseEngine(mockDefinition, {}, {
      onStateChange,
      onComplete: () => {}
    });

    expect(engine.getSession().state).toBe('idle');
    engine.start();
    expect(engine.getSession().state).toBe('running');
    expect(onStateChange).toHaveBeenCalled();
    engine.cleanup();
  });

  test('should complete and return result', () => {
    const onComplete = mock();
    const engine = new ExerciseEngine(mockDefinition, {}, {
      onStateChange: () => {},
      onComplete
    });

    engine.start();
    
    engine.updateMetrics({ correctCount: 5, errorCount: 1 });
    engine.complete();

    expect(engine.getSession().state).toBe('completed');
    expect(onComplete).toHaveBeenCalled();
    
    const result = onComplete.mock.calls[0][0];
    expect(result.exerciseId).toBe('test-exercise');
    expect(result.score.rawScore).toBe(5);
    // accuracy = 5 / 6 = 0.8333
    expect(result.score.accuracy).toBeCloseTo(0.833, 2);
    
    engine.cleanup();
  });

  test('should not complete if idle', () => {
    const onComplete = mock();
    const engine = new ExerciseEngine(mockDefinition, {}, {
      onStateChange: () => {},
      onComplete
    });

    engine.complete();
    expect(onComplete).not.toHaveBeenCalled();
    expect(engine.getSession().state).toBe('idle');
  });

  test('reset should clear session', () => {
    const engine = new ExerciseEngine(mockDefinition, {}, {
      onStateChange: () => {},
      onComplete: () => {}
    });

    engine.start();
    engine.updateMetrics({ correctCount: 10 });
    engine.reset();

    const session = engine.getSession();
    expect(session.state).toBe('idle');
    expect(session.startedAt).toBeNull();
    // Yeni id oluşturulmuş olmalı
    expect(session.id).toBeString();
  });
});
