import React from 'react';
import { XStack, Text, Switch, useTheme } from 'tamagui';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useMetronome } from '@/hooks/useMetronome';
import { AppCard } from '@/components/ui/AppCard';

export interface MetronomeControlProps {
  metronome: ReturnType<typeof useMetronome>;
}

// Tempo follows the on-screen word speed (one tick per word) - there is no
// separate BPM to set, so this is just an on/off switch.
export function MetronomeControl({ metronome }: MetronomeControlProps) {
  const { isEnabled, toggleEnabled } = metronome;
  const theme = useTheme();
  const { t } = useTranslation('exercises');

  return (
    <AppCard padding="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$2">
          {isEnabled ? (
            <Volume2 size={20} color={theme.color11?.val as string} />
          ) : (
            <VolumeX size={20} color={theme.color11?.val as string} />
          )}
          <Text fontWeight="bold">{t('labels.metronome')}</Text>
        </XStack>
        <Switch
          size="$3"
          accessibilityRole="switch"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={t('labels.metronomeToggle')}
          checked={isEnabled}
          onCheckedChange={toggleEnabled}
        >
          <Switch.Thumb />
        </Switch>
      </XStack>
    </AppCard>
  );
}
