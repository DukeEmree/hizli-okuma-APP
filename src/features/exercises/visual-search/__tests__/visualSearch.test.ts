/// <reference types="bun-types" />
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useVisualSearchEngine } from "@/features/exercises/visual-search/useVisualSearchEngine";

describe('VisualSearchEngine', () => {
  test('başlangıçta sayaçlar 0 ve durum idle olmalı', () => {
    const { result } = renderHook(() => useVisualSearchEngine({
      timeLimitMs: 30000,
    }));

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.isCompleted).toBe(false);
  });

  test('başlatıldığında ızgara kelimeleri ve hedef kelime atanmalı', () => {
    const { result } = renderHook(() => useVisualSearchEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.targetWord).toBeString();
    expect(result.current.targetWord.length).toBeGreaterThan(0);
    expect(result.current.gridWords.length).toBeGreaterThanOrEqual(9);
    expect(result.current.gridWords.includes(result.current.targetWord)).toBe(true);
  });

  test('hedef kelimeye tıklandığında correctCount ve totalAttempts artmalı', () => {
    const { result } = renderHook(() => useVisualSearchEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    const target = result.current.targetWord;
    act(() => {
      result.current.handleSelection(target);
    });

    expect(result.current.correctCount).toBe(1);
    expect(result.current.totalAttempts).toBe(1);
  });

  test('yanlış kelimeye tıklandığında sadece totalAttempts artmalı', () => {
    const { result } = renderHook(() => useVisualSearchEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.handleSelection('NON_EXISTENT_WRONG_WORD');
    });

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(1);
  });
});
