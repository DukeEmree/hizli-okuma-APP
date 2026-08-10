// @ts-ignore
import { expect, test, describe, mock } from 'bun:test';
import { ExerciseTimer } from "@/features/exercises/engine/ExerciseTimer";

describe('ExerciseTimer', () => {
  test('should start and increment elapsed time', async () => {
    const onTick = mock((ms: number) => {});
    const timer = new ExerciseTimer(onTick, 10);
    
    timer.start();
    expect(timer.isRunning()).toBe(true);

    // 20ms bekle
    await new Promise(r => setTimeout(r, 20));
    
    expect(timer.getElapsedMs()).toBeGreaterThan(0);
    expect(onTick).toHaveBeenCalled();
    
    timer.cleanup();
  });

  test('should pause and resume correctly', async () => {
    const onTick = mock();
    const timer = new ExerciseTimer(onTick, 10);
    
    timer.start();
    await new Promise(r => setTimeout(r, 20));
    
    timer.pause();
    expect(timer.isRunning()).toBe(false);
    
    const pausedMs = timer.getElapsedMs();
    
    // Duraklatıldıktan sonra zaman geçsin
    await new Promise(r => setTimeout(r, 20));
    
    // ElapsedMs aynı kalmalı
    expect(timer.getElapsedMs()).toBeCloseTo(pausedMs, 5); // 5ms hata payı
    
    timer.start(); // Resume
    expect(timer.isRunning()).toBe(true);
    
    await new Promise(r => setTimeout(r, 20));
    expect(timer.getElapsedMs()).toBeGreaterThan(pausedMs);
    
    timer.cleanup();
  });

  test('should reset correctly', () => {
    const onTick = mock();
    const timer = new ExerciseTimer(onTick, 10);
    
    timer.start();
    timer.reset();
    
    expect(timer.isRunning()).toBe(false);
    expect(timer.getElapsedMs()).toBe(0);
  });
});
