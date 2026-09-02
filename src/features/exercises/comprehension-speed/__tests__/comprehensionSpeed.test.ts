/// <reference types="bun-types" />
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useComprehensionSpeedEngine } from "@/features/exercises/comprehension-speed/useComprehensionSpeedEngine";

describe('ComprehensionSpeedEngine', () => {
  test('başlangıç durumu read fazında ve sayaçlar 0 olmalı', () => {
    const { result } = renderHook(() => useComprehensionSpeedEngine({
      timeLimitMs: 60000,
    }));

    expect(result.current.phase).toBe('read');
    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.isCompleted).toBe(false);
  });

  test('başlatıldığında metin içeriği yüklenmeli', () => {
    const { result } = renderHook(() => useComprehensionSpeedEngine({
      timeLimitMs: 60000,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.currentItem).not.toBeNull();
    expect(result.current.currentItem?.text).toBeString();
    expect(result.current.currentItem?.questions.length).toBeGreaterThan(0);
    expect(result.current.phase).toBe('read');
  });

  test('okuma tamamlandığında sorular fazına geçmeli ve WPM hesaplanmalı', () => {
    const { result } = renderHook(() => useComprehensionSpeedEngine({
      timeLimitMs: 60000,
    }));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.handleFinishedReading();
    });

    expect(result.current.phase).toBe('questions');
    expect(result.current.wpm).toBeGreaterThan(0);
    expect(result.current.currentQuestionIndex).toBe(0);
  });

  test('sorular doğru cevaplandığında correctCount artmalı ve son soruda egzersiz tamamlanmalı', () => {
    const { result } = renderHook(() => useComprehensionSpeedEngine({
      timeLimitMs: 60000,
    }));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.handleFinishedReading();
    });

    const questions = result.current.currentItem?.questions || [];
    for (let i = 0; i < questions.length; i++) {
      const correctIdx = questions[i].correctIndex;
      act(() => {
        result.current.handleSelection(correctIdx);
      });
    }

    expect(result.current.correctCount).toBe(questions.length);
    expect(result.current.totalAttempts).toBe(questions.length);
    expect(result.current.isCompleted).toBe(true);
    expect(result.current.session.state).toBe('completed');
  });
});
