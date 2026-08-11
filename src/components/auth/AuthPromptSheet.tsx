import React from 'react';
import { Sheet, YStack, H2, Text, XStack, Button } from 'tamagui';
import { useRouter } from 'expo-router';

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
            <Text color="$color" fontFamily="$body" fontSize="$4">İlerlemen güvenli şekilde kaydedilir</Text>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">📱</Text>
            <Text color="$color" fontFamily="$body" fontSize="$4">Farklı cihazlarda erişebilirsin</Text>
          </XStack>
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">⭐</Text>
            <Text color="$color" fontFamily="$body" fontSize="$4">Premium özelliklere erişebilirsin</Text>
          </XStack>
        </YStack>

        <YStack gap="$3" marginTop="auto">
          <Button
            size="$5"
            backgroundColor="$blue10"
            color="white"
            hoverStyle={{ backgroundColor: '$blue11' }}
            pressStyle={{ backgroundColor: '$blue9' }}
            onPress={handleLogin}
            theme="accent"
          >
            Giriş Yap / Kayıt Ol
          </Button>
          <Button
            size="$5"
            backgroundColor="transparent"
            color="$blue10"
            borderWidth={1}
            borderColor="$blue10"
            hoverStyle={{ backgroundColor: '$blue11' }}
            pressStyle={{ backgroundColor: '$blue9' }}
            onPress={() => onOpenChange(false)}
          >
            Şimdilik Misafir Olarak Devam Et
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
