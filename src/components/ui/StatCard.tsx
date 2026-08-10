import { YStack } from 'tamagui';
import { AppCard } from './AppCard';
import { AppText } from './AppText';

interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <AppCard padding="$4" flex={1}>
      <YStack gap="$2">
        <AppText variant="caption">{title}</AppText>
        <AppText variant="title">{value}</AppText>
      </YStack>
    </AppCard>
  );
}
