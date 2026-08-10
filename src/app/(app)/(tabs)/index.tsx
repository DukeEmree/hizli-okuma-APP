import React from 'react';
import { HEADER_RIGHT_SPACING } from '@/constants/layout';

import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, YStack, XStack, Card, H2, H4, Button, Progress, Spinner, ScrollView } from 'tamagui';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { StreakBadge } from "@/features/streak/StreakBadge";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useAuth } from '@clerk/clerk-expo';
import { useUserProgressStore } from '@/stores/userProgressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSyncStore } from '@/stores/syncStore';

export default function HomeScreen() {

  const router = useRouter();
  const { isPremium } = useRevenueCat();
  const { isLoaded, isSignedIn } = useAuth();
  
  const bestWpm = useUserProgressStore(state => state.bestWpm);
  const bestComprehension = useUserProgressStore(state => state.bestComprehension);
  const dailyGoalMinutes = useSettingsStore(state => state.dailyGoalMinutes);
  const pendingSessions = useSyncStore(state => state.pendingSessions);

  const shouldFetch = isLoaded && isSignedIn;
  const queryResult = useQuery(api.home.getDashboardData, shouldFetch ? undefined : 'skip');

  if (!isLoaded || (shouldFetch && queryResult === undefined)) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" />
      </View>
    );
  }

  let data;
  
  if (isSignedIn && queryResult) {
    data = queryResult;
  } else {
    // Construct local data for guest
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysSessions = pendingSessions.filter(s => s.completedAt >= todayStart.getTime());
    const todayTrainingMs = todaysSessions.reduce((sum, s) => sum + s.durationMs, 0);

    // Compute basic averages for guest from pendingSessions if they exist
    let totalWpm = 0, wpmCount = 0;
    let totalComp = 0, compCount = 0;
    for (const s of pendingSessions) {
      if (s.metrics?.wpm) {
        totalWpm += s.metrics.wpm;
        wpmCount++;
      }
      if (s.metrics?.comprehension !== undefined) {
        totalComp += s.metrics.comprehension;
        compCount++;
      }
    }

    // Guests never sync (SyncProvider only runs when signed in), so the
    // full pending queue is effectively this guest's whole local history -
    // sum it directly rather than a separate "total training seconds"
    // counter that's never actually incremented anywhere in the app.
    const totalTrainingMs = pendingSessions.reduce((sum, s) => sum + s.durationMs, 0);

    data = {
      user: {
        displayName: 'Misafir',
        trainingGoalMins: dailyGoalMinutes,
      },
      todayTrainingMs,
      stats: {
        avgWpm: wpmCount > 0 ? Math.round(totalWpm / wpmCount) : (bestWpm || null),
        avgComp: compCount > 0 ? Math.round(totalComp / compCount) : (bestComprehension || null),
        totalDurationMs: totalTrainingMs
      },
      recentSessions: pendingSessions.slice().sort((a, b) => b.completedAt - a.completedAt).slice(0, 5).map(s => ({
        _id: s.clientSessionId,
        ...s
      }))
    };
  }

  const { user, todayTrainingMs, stats, recentSessions } = data;
  const goalMs = user.trainingGoalMins * 60 * 1000;
  const progressPercent = Math.min(Math.round((todayTrainingMs / goalMs) * 100), 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$5">
          
          {/* Header & Streak */}
          <XStack justifyContent="space-between" alignItems="center" marginRight={HEADER_RIGHT_SPACING}>
            <YStack flex={1}>
              <H2>Merhaba {user.displayName ? user.displayName.split(' ')[0] : ''} 👋</H2>
              <Text color="$color11">Hoş geldin, hazır mısın?</Text>
            </YStack>
            <StreakBadge />
          </XStack>

          {/* Daily Goal */}
          <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation="$1">
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <H4>Bugünkü Hedef</H4>
                <Text fontWeight="bold">{progressPercent}%</Text>
              </XStack>
              <Progress value={progressPercent} size="$2">
                <Progress.Indicator />
              </Progress>
              <Text color="$color11" fontSize="$2">
                {Math.floor(todayTrainingMs / 60000)} / {user.trainingGoalMins} dakika tamamlandı
              </Text>
            </YStack>
          </Card>

          {/* Main CTA */}
          <Button 
            size="$5" 
            theme="accent" 
            fontWeight="bold"
            onPress={() => router.push('/(app)/(tabs)/exercises')}
          >
            Bugünkü Antrenmana Başla
          </Button>

          {/* Stats Row */}
          <XStack gap="$3" justifyContent="space-between">
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">Ort. Hız</Text>
              <Text fontSize="$7" fontWeight="bold">{stats.avgWpm || '-'} <Text fontSize="$2">WPM</Text></Text>
            </Card>
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">Kavrama</Text>
              <Text fontSize="$7" fontWeight="bold">{stats.avgComp ? `${stats.avgComp}%` : '-'}</Text>
            </Card>
            <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderColor" alignItems="center">
              <Text color="$color11" fontSize="$2" marginBottom="$1">Çalışma</Text>
              <Text fontSize="$7" fontWeight="bold">{Math.floor((stats.totalDurationMs || 0) / 60000)}<Text fontSize="$2"> dk</Text></Text>
            </Card>
          </XStack>

          {/* Premium CTA (If free user) */}
          {!isPremium && (
            <Card padding="$4" borderWidth={1} backgroundColor="$blue3" borderColor="$blue7" onPress={() => router.push('/paywall')}>
              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <H4 color="$blue11">Premium'a Geç</H4>
                  <Text color="$blue11" fontSize="$2">Sınırsız egzersiz ve detaylı analizler için hemen yükseltin.</Text>
                </YStack>
                <Button size="$3" theme="blue" onPress={() => router.push('/paywall')}>İncele</Button>
              </XStack>
            </Card>
          )}

          {/* Recent Activity */}
          <YStack gap="$3" marginTop="$2">
            <H4>Son Aktiviteler</H4>
            {recentSessions.length === 0 ? (
              <Text color="$color11">Henüz bir egzersiz yapmadınız.</Text>
            ) : (
              recentSessions.map((session: any) => {
                const dateObj = new Date(session.completedAt);
                return (
                  <Card key={session._id} padding="$3" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover">
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack>
                        <Text fontWeight="bold" textTransform="capitalize">{session.exerciseType}</Text>
                        <Text color="$color11" fontSize="$2">{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </YStack>
                      <YStack alignItems="flex-end">
                        <Text fontWeight="bold" color="$green10">Skor: {session.score}</Text>
                        {session.metrics?.wpm && (
                          <Text fontSize="$2" color="$color11">{session.metrics.wpm} WPM</Text>
                        )}
                      </YStack>
                    </XStack>
                  </Card>
                )
              })
            )}
          </YStack>

        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
