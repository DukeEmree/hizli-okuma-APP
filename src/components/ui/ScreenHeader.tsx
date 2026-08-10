import { XStack, H2, Button, View } from 'tamagui';
import { useRouter } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
}

export function ScreenHeader({ title, showBack = false }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <XStack padding="$4" alignItems="center" justifyContent={showBack ? 'space-between' : 'center'}>
      {showBack && (
        <Button size="$3" circular onPress={() => router.back()}>
          {'<-'}
        </Button>
      )}
      <H2>{title}</H2>
      {showBack && <View width={44} />}
    </XStack>
  );
}
