import { View } from 'tamagui';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View height={8} backgroundColor="$gray5Light" borderRadius="$4" overflow="hidden" width="100%">
      <View height="100%" width={`${safeProgress}%`} backgroundColor="$blue10Light" />
    </View>
  );
}
