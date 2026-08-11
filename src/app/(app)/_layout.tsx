import { Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingState } from "@/components/ui/LoadingState";

export default function AppLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingState />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="exercise/[exerciseId]" options={{ headerShown: false }} />
    </Stack>
  );
}
