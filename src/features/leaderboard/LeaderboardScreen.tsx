import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2, H4, Text, XStack, YStack, Button, Avatar, Spinner } from 'tamagui';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useTranslation } from 'react-i18next';
import { getPeriodString, LeaderboardPeriod } from "@/utils/leaderboard";

// Leaderboard Item Component
function LeaderboardItem({ entry, rank, isMe }: { entry: any; rank: number; isMe?: boolean }) {
  let rankColor = '$color11';
  if (rank === 1) rankColor = '$yellow10';
  else if (rank === 2) rankColor = '$gray9'; // silver
  else if (rank === 3) rankColor = '$orange10'; // bronze

  return (
    <XStack 
      backgroundColor={isMe ? '$blue3' : '$backgroundHover'} 
      padding="$3" 
      borderRadius="$4" 
      justifyContent="space-between" 
      alignItems="center"
      marginBottom="$2"
      borderWidth={isMe ? 1 : 0}
      borderColor="$blue8"
    >
      <XStack alignItems="center" gap="$3">
        <Text fontWeight="bold" fontSize={18} width={24} textAlign="center" color={rankColor}>
          {rank}
        </Text>
        <Avatar circular size="$4">
          {entry.avatarUrl ? (
            <Avatar.Image src={entry.avatarUrl} />
          ) : (
            <Avatar.Fallback backgroundColor="$gray5" />
          )}
        </Avatar>
        <Text fontWeight={isMe ? "bold" : "normal"}>{entry.nickname}</Text>
      </XStack>
      <Text fontWeight="bold">{entry.score}</Text>
    </XStack>
  );
}

export function LeaderboardScreen() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [now] = useState(() => Date.now());

  const currentPeriodStr = getPeriodString(now, period);

  const { results, status, loadMore } = usePaginatedQuery(
    api.leaderboard.getLeaderboard,
    { period: currentPeriodStr },
    { initialNumItems: 20 }
  );

  const myRank = useQuery(api.leaderboard.getMyRank, { period: currentPeriodStr });

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return <LeaderboardItem entry={item} rank={index + 1} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <YStack flex={1} backgroundColor="$background">
        {/* Header and Tabs */}
        <YStack padding="$4" paddingRight={48} gap="$4">
          <H2>{t('leaderboard.title', 'Liderlik Tablosu')}</H2>

          <XStack gap="$2" justifyContent="space-between">
            <Button size="$3" flex={1} theme={period === 'weekly' ? 'active' : undefined} onPress={() => setPeriod('weekly')}>
              {t('leaderboard.weekly', 'Haftalık')}
            </Button>
            <Button size="$3" flex={1} theme={period === 'monthly' ? 'active' : undefined} onPress={() => setPeriod('monthly')}>
              {t('leaderboard.monthly', 'Aylık')}
            </Button>
            <Button size="$3" flex={1} theme={period === 'allTime' ? 'active' : undefined} onPress={() => setPeriod('allTime')}>
              {t('leaderboard.allTime', 'Tüm Zamanlar')}
            </Button>
          </XStack>
        </YStack>

        {/* Sticky Personal Rank */}
        {myRank && myRank.score > 0 && (
          <YStack paddingHorizontal="$4" marginBottom="$2">
            <H4 fontSize={14} color="$color11" marginBottom="$2">Senin Sıran</H4>
            <LeaderboardItem 
              entry={{ nickname: t('leaderboard.you', 'Sen'), score: myRank.score }} 
              rank={myRank.rank} 
              isMe={true} 
            />
          </YStack>
        )}

        {/* Leaderboard List */}
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {status === 'LoadingFirstPage' ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <Spinner size="large" color="$blue10" />
            </YStack>
          ) : results.length === 0 ? (
            <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
              <H4>{t('leaderboard.empty', 'Henüz kimse puan kazanmadı.')}</H4>
            </YStack>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              onEndReached={() => {
                if (status === 'CanLoadMore') {
                  loadMore(20);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                status === 'LoadingMore' ? (
                  <YStack padding="$4" alignItems="center">
                    <Spinner />
                  </YStack>
                ) : null
              }
            />
          )}
        </View>
      </YStack>
    </SafeAreaView>
  );
}
