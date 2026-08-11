import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Dumbbell, ChartColumn, Settings } from 'lucide-react-native';
import { useTheme } from 'tamagui';

export default function TabsLayout() {
  const { t } = useTranslation('navigation');
  const theme = useTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.blue10?.val,
      tabBarInactiveTintColor: theme.color11?.val,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
      },
      tabBarStyle: {
        backgroundColor: theme.background?.val,
        borderTopColor: theme.borderColor?.val,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Home color={color as string} size={size} />
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: t('exercises'),
          tabBarIcon: ({ color, size }) => <Dumbbell color={color as string} size={size} />
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t('statistics'),
          tabBarIcon: ({ color, size }) => <ChartColumn color={color as string} size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings', { defaultValue: 'Ayarlar' }),
          tabBarIcon: ({ color, size }) => <Settings color={color as string} size={size} />
        }}
      />
    </Tabs>
  );
}
