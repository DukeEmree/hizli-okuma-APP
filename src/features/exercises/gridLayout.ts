/** Material's minimum touch target, in dp. */
export const MIN_TOUCH_TARGET = 48;

export interface GridLayoutOptions {
  /** Horizontal padding the runner already spends (`p="$4"` on both sides). */
  screenPadding?: number;
  /** Visual gap between cells. Also the slop budget: the target reaches `cell + gap`. */
  gap?: number;
  /** Cells never grow past this, so a wide window gets a board rather than a wall. */
  maxCell?: number;
  /** The board never spans more than this, for the same reason. */
  maxBoardWidth?: number;
  /** Cells never shrink past this, however narrow the window gets. */
  minCell?: number;
  /**
   * Window height, when the board must also fit vertically. Grids were sized
   * from width alone, so a dense board in a short window - split-screen, or
   * landscape on a large screen where the portrait lock does not hold - grew
   * taller than its stage and clipped its own bottom rows out of reach.
   */
  availableHeight?: number;
  /** Row count, required for the height constraint to mean anything. */
  rows?: number;
  /** Cell height as a fraction of its width. 1 = square. */
  cellAspect?: number;
}

/**
 * Vertical space a runner spends before the stage: `p="$4"` plus the `$8`
 * breathing room top and bottom, the exit/progress bar, the prompt line, and
 * the play control. Approximate on purpose - it only has to be close enough
 * that the board stops overflowing, and being generous costs a few dp of cell.
 */
export const RUNNER_VERTICAL_CHROME = 280;

export interface GridLayout {
  /** Drawn size of one cell. */
  cellSize: number;
  /** Gap actually used; only narrower than requested if the window forced it. */
  gap: number;
  /** Total board width; centre this rather than stretching it. */
  boardWidth: number;
  /** Padding around each cell's touch area. Half the gap, so neighbours never overlap. */
  hitSlop: number;
  /** The real touch target: `cellSize + 2 * hitSlop`. */
  touchTarget: number;
  /** Whether `touchTarget` reached `MIN_TOUCH_TARGET`. */
  meetsMinTarget: boolean;
}

/**
 * Size an exercise grid for the window it is actually in.
 *
 * The four grid exercises each had their own copy of this arithmetic with its
 * own magic numbers, and three of the four produced sub-48dp cells at their
 * highest difficulty on an ordinary phone - a tap the user reads as their own
 * miss, which then feeds the adaptive-difficulty penalty.
 *
 * The fix is that Material sizes the *target*, not the ink: each cell takes a
 * `hitSlop` of half the gap, exactly filling the space between neighbours
 * without ever overlapping them. That lifts the target to the full cell pitch
 * (`cellSize + gap`), which is the hard ceiling - a target cannot exceed its
 * pitch without stealing a neighbour's pixels, so the real constraint is just
 * `(usable + gap) / columns`.
 *
 * Worth stating because it is counter-intuitive: tightening the gap does *not*
 * help. It hands width to the cell but takes the same width off the slop
 * budget, and since pitch shrinks with it, the achievable target gets slightly
 * *worse*. When the pitch cannot reach 48dp the window is simply too narrow for
 * that many columns, and `meetsMinTarget` says so instead of the caller
 * silently shipping it.
 */
export function computeGridLayout(
  screenWidth: number,
  columns: number,
  options: GridLayoutOptions = {},
): GridLayout {
  const {
    screenPadding = 32,
    gap: preferredGap = 8,
    maxCell = 64,
    maxBoardWidth = 420,
    minCell = 24,
    availableHeight,
    rows,
    cellAspect = 1,
  } = options;

  const cols = Math.max(1, Math.floor(columns));
  const usable = Math.max(minCell, Math.min(screenWidth - screenPadding, maxBoardWidth));

  let gap = preferredGap;
  let cellSize = Math.floor((usable - (cols - 1) * gap) / cols);

  if (availableHeight !== undefined && rows && rows > 0) {
    const stage = Math.max(0, availableHeight - RUNNER_VERTICAL_CHROME);
    const fromHeight = Math.floor((stage - (rows - 1) * gap) / rows / cellAspect);
    cellSize = Math.min(cellSize, fromHeight);
  }

  cellSize = Math.min(maxCell, Math.max(minCell, cellSize));

  // The `minCell` floor can be wider than what is actually left in a very
  // narrow window - multi-window at its smallest, say - so give up the gap
  // before the cell, and the cell only when there is nothing left to give.
  let boardWidth = cellSize * cols + gap * (cols - 1);
  if (boardWidth > usable) {
    gap = Math.max(0, Math.floor((usable - cellSize * cols) / Math.max(1, cols - 1)));
    boardWidth = cellSize * cols + gap * (cols - 1);
  }
  if (boardWidth > usable) {
    cellSize = Math.max(1, Math.floor(usable / cols));
    gap = 0;
    boardWidth = cellSize * cols;
  }

  // Never wider than half the gap: two adjacent cells would otherwise claim the
  // same pixels and the closer edge would win arbitrarily.
  const needed = Math.ceil((MIN_TOUCH_TARGET - cellSize) / 2);
  const hitSlop = Math.max(0, Math.min(Math.floor(gap / 2), needed));

  const touchTarget = cellSize + hitSlop * 2;

  return {
    cellSize,
    gap,
    boardWidth,
    hitSlop,
    touchTarget,
    meetsMinTarget: touchTarget >= MIN_TOUCH_TARGET,
  };
}
