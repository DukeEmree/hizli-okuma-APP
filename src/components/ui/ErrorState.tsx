import { YStack } from 'tamagui';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');
  const displayMessage = message ?? t('error');
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4">
      <AppText variant="subtitle" color="$red10Light">Hata</AppText>
      <AppText textAlign="center">{displayMessage}</AppText>
      {onRetry && (
        <AppButton variant="outline" onPress={onRetry}>
          {t('retry')}
        </AppButton>
      )}
    </YStack>
  );
}
