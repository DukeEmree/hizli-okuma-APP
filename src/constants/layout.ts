/**
 * Widest a content column is ever drawn, in dp.
 *
 * DESIGN.md's One Column Rule says content is a single column at every width -
 * it does not say full-bleed at every width. A phone layout handed a tablet,
 * an unfolded foldable, or a wide split-screen window would otherwise stretch
 * its cards and run body text to a measure nobody can read. The column stays
 * one column and simply stops growing, centred in whatever space it is given.
 *
 * 560 keeps the three-up stat row comfortable and body text near the 65-75
 * character measure the type guidance asks for at this size.
 */
export const CONTENT_MAX_WIDTH = 560;

/** Inset in dp to ensure scroll content clears the floating bottom tab bar. */
export const TAB_BAR_INSET = 96;

/** Centres a content column and caps its width. Spread onto the column's root. */
export const contentColumn = {
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  alignSelf: 'center',
} as const;

