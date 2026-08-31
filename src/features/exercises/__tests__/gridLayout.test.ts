import { describe, expect, it } from 'bun:test';

import { computeGridLayout, MIN_TOUCH_TARGET, RUNNER_VERTICAL_CHROME } from '../gridLayout';

// Widths the app actually ships to: a small phone, the common phone, a large
// phone, and the short-but-wide window Android multi-window hands out.
const SMALL_PHONE = 320;
const PHONE = 360;
const LARGE_PHONE = 412;
const WIDE = 800;

describe('computeGridLayout', () => {
  it('never overlaps neighbouring touch areas', () => {
    for (const width of [SMALL_PHONE, PHONE, LARGE_PHONE, WIDE]) {
      for (let cols = 3; cols <= 8; cols++) {
        const { gap, hitSlop } = computeGridLayout(width, cols);
        expect(hitSlop * 2).toBeLessThanOrEqual(gap);
      }
    }
  });

  it('keeps the board inside the window', () => {
    for (const width of [SMALL_PHONE, PHONE, LARGE_PHONE]) {
      for (let cols = 3; cols <= 8; cols++) {
        const { boardWidth } = computeGridLayout(width, cols);
        expect(boardWidth).toBeLessThanOrEqual(width - 32);
      }
    }
  });

  it('reaches the 48dp target on a common phone at every shipped grid size', () => {
    // difficultyMapper tops out at 6 columns (schulte/scanning) and 7
    // (number-scan/visual-search).
    for (let cols = 3; cols <= 7; cols++) {
      const layout = computeGridLayout(PHONE, cols);
      expect(layout.touchTarget).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
      expect(layout.meetsMinTarget).toBe(true);
    }
  });

  it('keeps the design gap and lets slop do the work', () => {
    const dense = computeGridLayout(PHONE, 7);
    expect(dense.gap).toBe(8);
    expect(dense.cellSize).toBe(40);
    expect(dense.hitSlop).toBe(4);
    expect(dense.touchTarget).toBe(MIN_TOUCH_TARGET);
  });

  it('never lets a target exceed its own cell pitch', () => {
    // Beyond the pitch a cell is claiming pixels its neighbour also claims.
    for (const width of [SMALL_PHONE, PHONE, LARGE_PHONE, WIDE]) {
      for (let cols = 3; cols <= 8; cols++) {
        const { cellSize, gap, touchTarget } = computeGridLayout(width, cols);
        expect(touchTarget).toBeLessThanOrEqual(cellSize + gap);
      }
    }
  });

  it('a narrower gap does not buy a bigger target', () => {
    // The counter-intuitive part: shrinking the gap moves width from the slop
    // budget to the cell and lowers the pitch, so it cannot help.
    const wide = computeGridLayout(SMALL_PHONE, 7, { gap: 8 });
    const narrow = computeGridLayout(SMALL_PHONE, 7, { gap: 4 });
    expect(narrow.touchTarget).toBeLessThanOrEqual(wide.touchTarget);
  });

  it('reports honestly when the window is too narrow to comply', () => {
    // 8 columns on a 320dp phone cannot be made compliant by any gap or slop.
    const layout = computeGridLayout(SMALL_PHONE, 8);
    expect(layout.meetsMinTarget).toBe(false);
    expect(layout.hitSlop * 2).toBeLessThanOrEqual(layout.gap);
  });

  it('gives a board, not a wall, on a wide window', () => {
    const layout = computeGridLayout(WIDE, 5);
    expect(layout.cellSize).toBeLessThanOrEqual(64);
    expect(layout.boardWidth).toBeLessThanOrEqual(420);
  });

  it('is stable under the resize multi-window produces', () => {
    const before = computeGridLayout(PHONE, 5);
    const after = computeGridLayout(PHONE / 2, 5);
    expect(after.cellSize).toBeLessThan(before.cellSize);
    expect(after.boardWidth).toBeLessThanOrEqual(PHONE / 2 - 32);
    expect(after.cellSize).toBeGreaterThan(0);
  });

  it('fits the board vertically when a height is given', () => {
    // A 6x6 board sized from width alone is ~400dp tall; a split-screen window
    // has nothing like that to spare, and the bottom rows used to clip.
    const short = 520;
    const layout = computeGridLayout(PHONE, 6, {
      availableHeight: short,
      rows: 6,
    });
    const boardHeight = layout.cellSize * 6 + layout.gap * 5;
    expect(boardHeight).toBeLessThanOrEqual(short - RUNNER_VERTICAL_CHROME);
  });

  it('ignores the height constraint when the window is tall enough', () => {
    const tall = computeGridLayout(PHONE, 5, { availableHeight: 900, rows: 5 });
    const unconstrained = computeGridLayout(PHONE, 5);
    expect(tall.cellSize).toBe(unconstrained.cellSize);
  });

  it('accounts for non-square cells', () => {
    // Half-height chips fit twice as many rows in the same stage.
    const square = computeGridLayout(PHONE, 5, { availableHeight: 600, rows: 6 });
    const halfHeight = computeGridLayout(PHONE, 5, {
      availableHeight: 600,
      rows: 6,
      cellAspect: 0.5,
    });
    expect(halfHeight.cellSize).toBeGreaterThan(square.cellSize);
  });

  it('still yields a usable cell in a punishing window', () => {
    const layout = computeGridLayout(300, 6, { availableHeight: 320, rows: 6 });
    expect(layout.cellSize).toBeGreaterThan(0);
    expect(layout.boardWidth).toBeLessThanOrEqual(300 - 32);
    expect(layout.hitSlop * 2).toBeLessThanOrEqual(layout.gap);
  });
});
