import React, { useState } from 'react';
import { Sheet, YStack, H4, Button } from 'tamagui';
import { Menu, Trophy } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TopMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('navigation');
  const insets = useSafeAreaInsets();

  const handleNavigate = (path: any) => {
    setOpen(false);
    // Give the sheet a tiny bit of time to start closing animation for smoother UX
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  return (
    <>
      <Button
        position="absolute"
        top={insets.top + 8}
        right={16}
        zIndex={100}
        circular
        size="$4"
        icon={Menu}
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        elevation={2}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t('openMenu')}
      />

      <Sheet 
        modal 
        open={open} 
        onOpenChange={setOpen} 
        snapPoints={[40]} 
        dismissOnSnapToBottom
      >
        <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$5" paddingBottom={insets.bottom + 20} backgroundColor="$background">
          <YStack gap="$4">
            <H4 marginBottom="$2">{t('menu')}</H4>

            <Button 
              icon={Trophy} 
              justifyContent="flex-start" 
              size="$5"
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => handleNavigate('/(app)/leaderboard')}
            >
              {t('leaderboard')}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
