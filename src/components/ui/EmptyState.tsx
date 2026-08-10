import { YStack } from 'tamagui';
import { AppText } from './AppText';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const { t } = useTranslation('common');
  const displayMessage = message ?? t('empty');
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <AppText variant="subtitle">{displayMessage}</AppText>
    </YStack>
  );
}
