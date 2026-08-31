import { Card, useThemeName, type CardProps } from 'tamagui';

export type AppCardLift = 'rest' | 'raised' | 'overlay' | 'flat';

/**
 * The system's card surface: soft, wide, low-opacity lift in light mode and a
 * tonal step plus a hairline in dark mode.
 *
 * Dark mode deliberately drops the shadow entirely - a shadow on a near-black
 * ground carries no information, so depth there comes from `$backgroundHover`
 * sitting one tonal step above `$background` with a `$borderColor` hairline.
 * Light mode is the inverse: the shadow is the separator and a hard 1px
 * outline would flatten it back out.
 *
 * On Android the shadow is drawn by `elevation`, not by the iOS shadow props -
 * those are kept for the planned iOS build and for RN Web. Material's own
 * elevation curve is already an ambient + key shadow pair, which is what the
 * design's "wide and faint" intent describes, so the values below stay low
 * (2 / 4 / 12) rather than trying to fight it.
 */
const LIFT_LIGHT: Record<
  AppCardLift,
  {
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    elevationAndroid?: number;
  }
> = {
  rest: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevationAndroid: 2,
  },
  raised: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevationAndroid: 4,
  },
  overlay: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 48,
    elevationAndroid: 12,
  },
  flat: {},
};

export interface AppCardProps extends CardProps {
  /** `raised` marks the one card carrying the screen's primary action. */
  lift?: AppCardLift;
}

export function AppCard({ lift = 'rest', children, ...props }: AppCardProps) {
  const isDark = useThemeName().startsWith('dark');

  return (
    <Card
      backgroundColor="$backgroundHover"
      borderRadius="$4"
      padding="$4"
      {...(isDark
        ? { borderWidth: 1, borderColor: '$borderColor' }
        : { shadowColor: '$shadowColor', ...LIFT_LIGHT[lift] })}
      {...props}
    >
      {children}
    </Card>
  );
}
