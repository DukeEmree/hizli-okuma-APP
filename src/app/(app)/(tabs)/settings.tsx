import React, { useState } from 'react';
import { ScrollView, Alert, Text } from 'react-native';
import { YStack, XStack, Sheet, Separator, Button, Spinner, useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

import { AppText } from "@/components/ui/AppText";
import { AppButton } from "@/components/ui/AppButton";
import { useSettingsStore, ThemeType, LanguageType } from "@/stores/settingsStore";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { useStatisticsStore } from "@/stores/useStatisticsStore";
import { useUserProgressStore } from "@/stores/userProgressStore";
import { useStreakCacheStore } from "@/stores/streakCacheStore";

import { 
  Sun, Moon, Monitor, Languages, 
  Crown, CreditCard, User, LogOut, LogIn,
  RotateCcw, Trash2, ChevronRight, Check
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation('settings');
  const router = useRouter();
  const themeContext = useTheme();
  
  // Stores
  const { theme, setTheme, language, setLanguage } = useSettingsStore();
  const { isPremium, customerInfo, isConfigured } = useRevenueCat();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // Convex Mutations
  const resetMyStatistics = useMutation(api.users.resetMyStatistics);
  const deleteMyAccount = useMutation(api.users.deleteMyAccount);

  // States for Sheets
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [resetStatsSheetOpen, setResetStatsSheetOpen] = useState(false);
  const [deleteAccountSheetOpen, setDeleteAccountSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handlers
  const handleThemeChange = (val: ThemeType) => {
    setTheme(val);
    setThemeSheetOpen(false);
  };

  const handleLangChange = (val: LanguageType) => {
    setLanguage(val);
    i18n.changeLanguage(val);
    setLangSheetOpen(false);
  };

  const handleResetStats = async () => {
    setIsProcessing(true);
    try {
      if (isSignedIn) {
        await resetMyStatistics();
      }
      // Reset local stores
      useExerciseProgressStore.getState().resetAll();
      useStatisticsStore.getState().invalidate();
      useUserProgressStore.getState().resetProgress();
      useStreakCacheStore.getState().resetCache();
      
      setResetStatsSheetOpen(false);
      Alert.alert("Başarılı", t('dangerZone.successReset') || "İstatistiklerin sıfırlandı.");
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "İstatistikler sıfırlanamadı");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      if (isSignedIn) {
        await deleteMyAccount();
        if (user) {
          await user.delete();
        }
        await signOut();
      }
      
      // Reset local stores
      useExerciseProgressStore.getState().resetAll();
      useStatisticsStore.getState().invalidate();
      useUserProgressStore.getState().resetProgress();
      useStreakCacheStore.getState().resetCache();

      setDeleteAccountSheetOpen(false);
      router.replace('/');
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Hesap silinemedi");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const iconColor = themeContext.color?.val || '#000';
  const dangerColor = themeContext.red10?.val || 'red';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeContext.background?.val }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        
        {/* Header */}
        <YStack gap="$2" marginBottom="$6">
          <AppText variant="title">{t('title')}</AppText>
          <AppText variant="caption" color="$color10">{t('subtitle')}</AppText>
        </YStack>

        {/* Appearance Section */}
        <SettingsSection title={t('appearance.title')}>
          <SettingsRow 
            icon={<Sun color={iconColor} size={20} />} 
            title={t('appearance.theme')}
            value={t(`appearance.themeOptions.${theme}`)}
            onPress={() => setThemeSheetOpen(true)}
          />
          <Separator marginVertical="$2" borderColor="$borderColor" />
          <SettingsRow 
            icon={<Languages color={iconColor} size={20} />} 
            title={t('appearance.language')}
            value={t(`appearance.languageOptions.${language}` as any)}
            onPress={() => setLangSheetOpen(true)}
          />
        </SettingsSection>

        {/* Subscription Section */}
        <SettingsSection title={t('subscription.title')}>
          {!isConfigured ? (
            <XStack paddingVertical="$2" justifyContent="center">
              <Spinner color="$primary" />
            </XStack>
          ) : isPremium ? (
            <SettingsRow 
              icon={<Crown color={themeContext.yellow10?.val || '#FFD700'} size={20} />} 
              title={t('subscription.premium')}
              subtitle={t('subscription.premiumDesc')}
            />
          ) : (
            <SettingsRow 
              icon={<CreditCard color={iconColor} size={20} />} 
              title={t('subscription.freePlan')}
              subtitle={t('subscription.freeDesc')}
              onPress={() => {
                if (!isSignedIn) {
                  router.push('/(auth)/login');
                } else {
                  router.push('/paywall');
                }
              }}
              actionText={t('subscription.upgrade')}
            />
          )}
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title={t('account.title')}>
          {isSignedIn && user ? (
            <>
              <SettingsRow 
                icon={<User color={iconColor} size={20} />} 
                title={user.fullName || user.emailAddresses[0]?.emailAddress || "User"}
                subtitle={user.emailAddresses[0]?.emailAddress}
              />
              <Separator marginVertical="$2" borderColor="$borderColor" />
              <SettingsRow 
                icon={<LogOut color={dangerColor} size={20} />} 
                title={t('account.logout')}
                titleColor="$red10"
                onPress={handleLogout}
                loading={isProcessing}
              />
            </>
          ) : (
            <SettingsRow 
              icon={<LogIn color={iconColor} size={20} />} 
              title={t('account.loginOrRegister') !== 'account.loginOrRegister' ? t('account.loginOrRegister') : "Giriş Yap veya Kayıt Ol"}
              onPress={() => {
                console.log("Login Row Pressed");
                router.push('/(auth)/login');
              }}
            />
          )}
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title={t('dangerZone.title')} titleColor="$red10">
          <SettingsRow 
            icon={<RotateCcw color={dangerColor} size={20} />} 
            title={t('dangerZone.resetStats') !== 'dangerZone.resetStats' ? t('dangerZone.resetStats') : "İstatistikleri Sıfırla"}
            titleColor="$red10"
            subtitle={t('dangerZone.resetStatsDesc') !== 'dangerZone.resetStatsDesc' ? t('dangerZone.resetStatsDesc') : "Okuma geçmişini ve performans verilerini sil."}
            onPress={() => setResetStatsSheetOpen(true)}
          />
          <Separator marginVertical="$2" borderColor="$borderColor" />
          <SettingsRow 
            icon={<Trash2 color={dangerColor} size={20} />} 
            title={t('dangerZone.deleteAccount') !== 'dangerZone.deleteAccount' ? t('dangerZone.deleteAccount') : "Hesabı Sil"}
            titleColor="$red10"
            subtitle={t('dangerZone.deleteAccountDesc') !== 'dangerZone.deleteAccountDesc' ? t('dangerZone.deleteAccountDesc') : "Hesabını ve ilişkili verilerini kalıcı olarak sil."}
            onPress={() => setDeleteAccountSheetOpen(true)}
          />
        </SettingsSection>

      </ScrollView>

      {/* Theme Sheet */}
      <SelectionSheet 
        open={themeSheetOpen} 
        onOpenChange={setThemeSheetOpen} 
        title={t('appearance.theme')}
        options={[
          { label: t('appearance.themeOptions.light'), value: 'light', icon: <Sun size={20} color={iconColor} /> },
          { label: t('appearance.themeOptions.dark'), value: 'dark', icon: <Moon size={20} color={iconColor} /> },
          { label: t('appearance.themeOptions.system'), value: 'system', icon: <Monitor size={20} color={iconColor} /> }
        ]}
        currentValue={theme}
        onSelect={(v: any) => handleThemeChange(v as ThemeType)}
      />

      {/* Language Sheet */}
      <SelectionSheet 
        open={langSheetOpen} 
        onOpenChange={setLangSheetOpen} 
        title={t('appearance.language')}
        options={[
          { label: t('appearance.languageOptions.tr'), value: 'tr', icon: <Languages size={20} color={iconColor} /> },
        ]}
        currentValue={language}
        onSelect={(v: any) => handleLangChange(v as LanguageType)}
      />

      {/* Reset Stats Confirmation */}
      <ConfirmationSheet
        open={resetStatsSheetOpen}
        onOpenChange={setResetStatsSheetOpen}
        title={t('dangerZone.resetStats')}
        description={t('dangerZone.resetStatsConfirm')}
        confirmText={t('dangerZone.confirmReset')}
        cancelText={t('dangerZone.cancel')}
        onConfirm={handleResetStats}
        isProcessing={isProcessing}
        destructive
      />

      {/* Delete Account Confirmation */}
      <ConfirmationSheet
        open={deleteAccountSheetOpen}
        onOpenChange={setDeleteAccountSheetOpen}
        title={t('dangerZone.deleteAccount')}
        description={t('dangerZone.deleteAccountConfirm')}
        confirmText={t('dangerZone.confirmDelete')}
        cancelText={t('dangerZone.cancel')}
        onConfirm={handleDeleteAccount}
        isProcessing={isProcessing}
        destructive
      />
    </SafeAreaView>
  );
}

// -------------------------------------------------------------
// Sub-components
// -------------------------------------------------------------

function SettingsSection({ title, titleColor, children }: { title: string, titleColor?: string, children: React.ReactNode }) {
  return (
    <YStack marginBottom="$5">
      <AppText variant="caption" color={titleColor || "$color10"} marginBottom={8} marginLeft={8} textTransform="uppercase" fontWeight="bold">
        {title}
      </AppText>
      <YStack backgroundColor="$backgroundHover" borderRadius="$4" padding="$3" overflow="hidden">
        {children}
      </YStack>
    </YStack>
  );
}

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  titleColor?: string;
  subtitle?: string;
  value?: string;
  actionText?: string;
  onPress?: () => void;
  loading?: boolean;
}

function SettingsRow({ icon, title, titleColor, subtitle, value, actionText, onPress, loading }: SettingsRowProps) {
  const theme = useTheme();
  
  const resolvedTitleColor = titleColor === '$red10' 
    ? (theme.red10?.val || 'red') 
    : (theme.color?.val || '#000');
  const resolvedSubtitleColor = theme.color10?.val || '#888';

  const content = (
    <XStack alignItems="center" gap="$3" paddingVertical="$2" opacity={loading ? 0.5 : 1}>
      {icon}
      <YStack flex={1}>
        <Text style={{ color: resolvedTitleColor, fontSize: 16, fontFamily: 'Inter' }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: resolvedSubtitleColor, fontSize: 13, fontFamily: 'Inter', marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </YStack>
      {loading ? (
        <Spinner size="small" color={theme.color?.val} />
      ) : value ? (
        <XStack alignItems="center" gap="$2">
          <Text style={{ color: theme.color10?.val, fontSize: 14, fontFamily: 'Inter' }}>{value}</Text>
          <ChevronRight color={theme.color10?.val || '#888'} size={20} />
        </XStack>
      ) : actionText ? (
        <AppButton size="$3" onPress={onPress}>{actionText}</AppButton>
      ) : onPress ? (
        <ChevronRight color={theme.color10?.val || '#888'} size={20} />
      ) : null}
    </XStack>
  );

  if (onPress && !actionText && !loading) {
    return (
      <XStack 
        onPress={onPress} 
        pressStyle={{ opacity: 0.7 }}
        cursor="pointer"
      >
        {content}
      </XStack>
    );
  }

  return content;
}

// -------------------------------------------------------------
// Sheets
// -------------------------------------------------------------

function SelectionSheet({ open, onOpenChange, title, options, currentValue, onSelect }: any) {
  const theme = useTheme();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal dismissOnSnapToBottom snapPoints={[40]}>
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <YStack gap="$4">
          <AppText variant="title" style={{ textAlign: 'center', marginBottom: 8 }}>{title}</AppText>
          {options.map((opt: any) => (
            <Button
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              backgroundColor={currentValue === opt.value ? '$backgroundHover' : 'transparent'}
              justifyContent="flex-start"
              padding="$3"
              borderWidth={0}
              icon={opt.icon}
            >
              <XStack flex={1} alignItems="center" justifyContent="space-between">
                <AppText style={{ fontSize: 16 }}>{opt.label}</AppText>
                {currentValue === opt.value && <Check size={20} color={theme.primary?.val || '#000'} />}
              </XStack>
            </Button>
          ))}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

function ConfirmationSheet({ open, onOpenChange, title, description, confirmText, cancelText, onConfirm, isProcessing, destructive }: any) {
  const theme = useTheme();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal dismissOnSnapToBottom snapPoints={[35]}>
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <YStack gap="$4">
          <AppText variant="title" style={{ textAlign: 'center', color: destructive ? theme.red10?.val : theme.color?.val }}>
            {title}
          </AppText>
          <AppText style={{ textAlign: 'center', color: theme.color10?.val, marginBottom: 16 }}>
            {description}
          </AppText>
          
          <YStack gap="$3">
            <AppButton 
              variant={destructive ? "secondary" : "primary"} 
              backgroundColor={destructive ? "$red10" : undefined}
              color={destructive ? "white" : undefined}
              onPress={onConfirm} 
              disabled={isProcessing}
            >
              {isProcessing ? <Spinner color="#fff" /> : confirmText}
            </AppButton>
            <AppButton 
              variant="outline" 
              onPress={() => onOpenChange(false)} 
              disabled={isProcessing}
            >
              {cancelText}
            </AppButton>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

