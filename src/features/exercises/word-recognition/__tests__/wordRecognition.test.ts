/// <reference types="bun-types" />
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWordRecognitionEngine } from "@/features/exercises/word-recognition/useWordRecognitionEngine";

describe('WordRecognitionEngine', () => {
  test('başlangıçta sayaçlar sıfır olmalı ve hedef boş olmalı', () => {
    const { result } = renderHook(() => useWordRecognitionEngine({
      timeLimitMs: 30000,
    }));

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.isCompleted).toBe(false);
  });

  test('başlatıldığında otomatik hedef ve seçenekler üretmeli', () => {
    const { result } = renderHook(() => useWordRecognitionEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.currentTarget).toBeString();
    expect(result.current.currentTarget.length).toBeGreaterThan(0);
    expect(result.current.options.length).toBeGreaterThanOrEqual(3);
    expect(result.current.options.includes(result.current.currentTarget)).toBe(true);
  });

  test('doğru kelime seçildiğinde correctCount ve totalAttempts artmalı', () => {
    const { result } = renderHook(() => useWordRecognitionEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    const target = result.current.currentTarget;
    act(() => {
      result.current.handleSelection(target);
    });

    expect(result.current.correctCount).toBe(1);
    expect(result.current.totalAttempts).toBe(1);
  });

  test('yanlış kelime seçildiğinde sadece totalAttempts artmalı', () => {
    const { result } = renderHook(() => useWordRecognitionEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    const wrongWord = 'NON_EXISTENT_WRONG_TARGET_WORD';
    act(() => {
      result.current.handleSelection(wrongWord);
    });

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(1);
  });

  test('reset çağrıldığında sayaçlar ve durum sıfırlanmalı', () => {
    const { result } = renderHook(() => useWordRecognitionEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    const target = result.current.currentTarget;
    act(() => {
      result.current.handleSelection(target);
    });

    expect(result.current.correctCount).toBe(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.isCompleted).toBe(false);
  });
});
