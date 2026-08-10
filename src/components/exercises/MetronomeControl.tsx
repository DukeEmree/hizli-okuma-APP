import React from 'react';
import { XStack, YStack, Text, Button, Switch, Card, useTheme } from 'tamagui';
import { Volume2, VolumeX, Plus, Minus } from 'lucide-react-native';
import { useMetronome } from '@/hooks/useMetronome';

export interface MetronomeControlProps {
  metronome: ReturnType<typeof useMetronome>;
}

export function MetronomeControl({ metronome }: MetronomeControlProps) {
  const { isEnabled, bpm, toggleEnabled, increaseBpm, decreaseBpm } = metronome;
  const theme = useTheme();

  return (
    <Card padding="$3" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1">
      <YStack gap="$3">
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

        {isEnabled && (
          <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
            <Text color="$color11" fontSize="$4">Tempo</Text>
            <XStack alignItems="center" gap="$3">
              <Button size="$3" circular icon={Minus} onPress={decreaseBpm} accessibilityLabel="Tempoyu düşür" accessibilityRole="button" disabled={bpm <= 30} />
              <Text fontWeight="bold" width={60} textAlign="center">{bpm} BPM</Text>
              <Button size="$3" circular icon={Plus} onPress={increaseBpm} accessibilityLabel="Tempoyu artır" accessibilityRole="button" disabled={bpm >= 600} />
            </XStack>
          </XStack>
        )}
      </YStack>
    </Card>
  );
}
