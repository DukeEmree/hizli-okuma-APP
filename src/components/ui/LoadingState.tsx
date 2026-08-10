import { Spinner, YStack } from 'tamagui';
import { AppText } from './AppText';
import { useTranslation } from 'react-i18next';

export function LoadingState({ message }: { message?: string }) {
  const { t } = useTranslation('common');
  const displayMessage = message ?? t('loading');
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
      <Spinner size="large" color="$color" />
      <AppText variant="caption">{displayMessage}</AppText>
    </YStack>
  );
}
