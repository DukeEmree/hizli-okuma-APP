import { Spinner, Text, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';

export function LoadingState({ message }: { message?: string }) {
  const { t } = useTranslation('common');
  const displayMessage = message ?? t('loading');
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4">
      <Spinner size="large" color="$color" />
      <Text fontSize="$2" color="$color10" fontFamily="$body">{displayMessage}</Text>
    </YStack>
  );
}
