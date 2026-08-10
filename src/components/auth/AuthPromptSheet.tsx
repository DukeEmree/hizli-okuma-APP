import React from 'react';
import { Sheet, YStack, H2, Text, XStack } from 'tamagui';
import { useRouter } from 'expo-router';
import { AppText } from "@/components/ui/AppText";
import { AppButton } from "@/components/ui/AppButton";

interface AuthPromptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function AuthPromptSheet({ open, onOpenChange, title, description }: AuthPromptSheetProps) {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push('/(auth)/login');
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[65]}
      dismissOnSnapToBottom
      position={0}
      zIndex={100000}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding="$5" gap="$4" backgroundColor="$background">
        <YStack gap="$2" marginBottom="$4">
          <H2 size="$8" textAlign="center">
            {title || 'Hesap Oluşturmanın Avantajları'}
          </H2>
          <Text color="$color11" textAlign="center" fontSize="$5">
            {description || 'Bu özelliği kullanmak için ücretsiz bir hesap oluşturman gerekiyor.'}
          </Text>
        </YStack>

        <YStack gap="$3" marginBottom="$4" paddingHorizontal="$2">
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">🔒</Text>
            <AppText>İlerlemen güvenli şekilde kaydedilir</AppText>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">📱</Text>
            <AppText>Farklı cihazlarda erişebilirsin</AppText>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">🏆</Text>
            <AppText>Liderlik tablosuna katılabilirsin</AppText>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">⭐</Text>
            <AppText>Premium özelliklere erişebilirsin</AppText>
          </XStack>
        </YStack>

        <YStack gap="$3" marginTop="auto">
          <AppButton size="$5" onPress={handleLogin} theme="accent">
            Giriş Yap / Kayıt Ol
          </AppButton>
          <AppButton size="$5" btnType="outline" onPress={() => onOpenChange(false)}>
            Şimdilik Misafir Olarak Devam Et
          </AppButton>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
