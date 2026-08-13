import React from 'react';
import { XStack, Text, Switch, Card, useTheme } from 'tamagui';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useMetronome } from '@/hooks/useMetronome';

export interface MetronomeControlProps {
  metronome: ReturnType<typeof useMetronome>;
}

// Tempo follows the on-screen word speed (one tick per word) - there is no
// separate BPM to set, so this is just an on/off switch.
export function MetronomeControl({ metronome }: MetronomeControlProps) {
  const { isEnabled, toggleEnabled } = metronome;
  const theme = useTheme();

  return (
    <Card padding="$3" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$2">
          {isEnabled ? (
            <Volume2 size={20} color={theme.color11?.val as string} />
          ) : (
            <VolumeX size={20} color={theme.color11?.val as string} />
          )}
          <Text fontWeight="bold">Metronom</Text>
        </XStack>
        <Switch size="$3" accessibilityRole="switch" accessibilityLabel="Metronom Aç/Kapat" checked={isEnabled} onCheckedChange={toggleEnabled}>
          <Switch.Thumb />
        </Switch>
      </XStack>
    </Card>
  );
}
