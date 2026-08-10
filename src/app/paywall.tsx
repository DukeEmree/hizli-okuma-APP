import React from 'react';
import { Stack } from 'expo-router';
import PaywallScreen from "@/features/subscription/PaywallScreen";

export default function PaywallRoute() {
  return (
    <>
      <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />
      <PaywallScreen />
    </>
  );
}
