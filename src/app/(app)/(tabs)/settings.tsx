import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Platform, Switch as RNSwitch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Separator,
  Sheet,
  SizableText,
  Spinner,
  Switch,
  useTheme,
  XStack,
  YStack,
} from "tamagui";
import { api } from "@/convex/_generated/api";

import { AppButton } from "@/components/ui/AppButton";
import { AppText } from "@/components/ui/AppText";
import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import {
  LanguageType,
  ThemeType,
  useSettingsStore,
} from "@/stores/settingsStore";
import { useStreakCacheStore } from "@/stores/streakCacheStore";
import { useStatisticsStore } from "@/stores/useStatisticsStore";
import { useSyncStore } from "@/stores/syncStore";
import { useUserProgressStore } from "@/stores/userProgressStore";

import {
  Check,
  ChevronRight,
  CreditCard,
  Crown,
  Languages,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  RotateCcw,
  Sun,
  Trash2,
  User,
  Bell,
  Clock,
  Flame,
  TrendingUp,
} from "lucide-react-native";
import { requestNotificationPermissions, rescheduleAllReminders } from '@/services/notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import RevenueCatUI from "react-native-purchases-ui";
import { SUBSCRIPTION_CONSTANTS } from "@/constants/subscription";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation("settings");
  const router = useRouter();
  const themeContext = useTheme();

  // Stores
  const theme = useSettingsStore(s => s.theme);
  const setTheme = useSettingsStore(s => s.setTheme);
  const language = useSettingsStore(s => s.language);
  const setLanguage = useSettingsStore(s => s.setLanguage);
  const notificationsEnabled = useSettingsStore(s => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore(s => s.setNotificationsEnabled);
  const dailyReminderEnabled = useSettingsStore(s => s.dailyReminderEnabled);
  const setDailyReminderEnabled = useSettingsStore(s => s.setDailyReminderEnabled);
  const dailyReminderTime = useSettingsStore(s => s.dailyReminderTime);
  const setDailyReminderTime = useSettingsStore(s => s.setDailyReminderTime);
  const streakReminderEnabled = useSettingsStore(s => s.streakReminderEnabled);
  const setStreakReminderEnabled = useSettingsStore(s => s.setStreakReminderEnabled);
  const progressNotificationsEnabled = useSettingsStore(s => s.progressNotificationsEnabled);
  const setProgressNotificationsEnabled = useSettingsStore(s => s.setProgressNotificationsEnabled);

  const { isPremium, customerInfo, isConfigured } = useRevenueCat();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // States for Sheets and Pickers
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [resetStatsSheetOpen, setResetStatsSheetOpen] = useState(false);
  const [deleteAccountSheetOpen, setDeleteAccountSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTime, setPickerTime] = useState(new Date());

  // Notification Toggle Handler
  const handleToggleNotifications = async (val: boolean) => {
    if (val) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(t("notifications.title", "Bildirimler"), t("notifications.permissionRequired", "Bildirimlere izin vermek için ayarlardan uygulamaya izin vermelisiniz."));
        setNotificationsEnabled(false);
        return;
      }
    }
    setNotificationsEnabled(val);
    rescheduleAllReminders().catch(console.error);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setPickerTime(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setDailyReminderTime(`${hours}:${minutes}`);
      rescheduleAllReminders().catch(console.error);
    }
  };

  const handleDismiss = () => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
  };

  const openTimePicker = () => {
    const parts = dailyReminderTime.split(':');
    const d = new Date();
    if (parts.length === 2) {
      d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
    }
    setPickerTime(d);
    setShowTimePicker(true);
  };

  // Convex Mutations
  const resetMyStatistics = useMutation(api.users.resetMyStatistics);
  const deleteMyAccount = useMutation(api.users.deleteMyAccount);



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
      // Also clear the pending sync queue - otherwise SyncProvider's
      // background sync re-writes the just-reset sessions/progress to
      // Convex the next time it runs.
      useSyncStore.getState().clearQueue();

      setResetStatsSheetOpen(false);
      Alert.alert(
        "Başarılı",
        t("dangerZone.successReset") || "İstatistiklerin sıfırlandı.",
      );
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
      useSyncStore.getState().clearQueue();

      setDeleteAccountSheetOpen(false);
      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Hesap silinemedi");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (error) {
      console.error("Customer Center error:", error);
      Alert.alert("Hata", t("subscription.errorCustomerCenter", "Abonelik yönetimi şu anda açılamıyor. Lütfen tekrar deneyin."));
    }
  };

  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const iconColor = themeContext.color?.val;
  const dangerColor = themeContext.error9?.val || themeContext.red10?.val;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeContext.background?.val }}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Header */}
        <YStack gap="$2" marginBottom="$6">
          <AppText variant="title">{t("title")}</AppText>
          <AppText variant="caption" color="$color10">
            {t("subtitle")}
          </AppText>
        </YStack>

        {/* Appearance Section */}
        <SettingsSection title={t("appearance.title")}>
          <SettingsRow
            icon={<Sun color={iconColor} size={20} />}
            title={t("appearance.theme")}
            value={t(`appearance.themeOptions.${theme}`)}
            onPress={() => setThemeSheetOpen(true)}
          />
          <Separator marginVertical="$2" borderColor="$borderColor" />
          <SettingsRow
            icon={<Languages color={iconColor} size={20} />}
            title={t("appearance.language")}
            value={t(`appearance.languageOptions.${language}` as any)}
            onPress={() => setLangSheetOpen(true)}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title={t("notifications.title", "Bildirimler")}>
          <SettingsRow
            icon={<Bell color={iconColor} size={20} />}
            title={t("notifications.enableNotifications", "Genel Bildirimler")}
            isSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={handleToggleNotifications}
          />
          {notificationsEnabled && (
            <>
              <Separator marginVertical="$2" borderColor="$borderColor" />
              <SettingsRow
                icon={<Clock color={iconColor} size={20} />}
                title={t("notifications.dailyReminder", "Günlük Hatırlatma")}
                isSwitch
                switchValue={dailyReminderEnabled}
                onSwitchChange={(val) => {
                  setDailyReminderEnabled(val);
                  rescheduleAllReminders().catch(console.error);
                }}
              />
              <SettingsRow
                icon={<Clock color={iconColor} size={20} />}
                title={t("notifications.reminderTime", "Hatırlatma Saati")}
                value={dailyReminderTime}
                onPress={openTimePicker}
              />
              {showTimePicker && (
                <DateTimePicker
                  value={pickerTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onValueChange={handleTimeChange}
                  onDismiss={handleDismiss}
                />
              )}
              <Separator marginVertical="$2" borderColor="$borderColor" />
              <SettingsRow
                icon={<Flame color={iconColor} size={20} />}
                title={t("notifications.streakReminder", "Seri Hatırlatmaları")}
                isSwitch
                switchValue={streakReminderEnabled}
                onSwitchChange={(val) => {
                  setStreakReminderEnabled(val);
                  rescheduleAllReminders().catch(console.error);
                }}
              />
              <Separator marginVertical="$2" borderColor="$borderColor" />
              <SettingsRow
                icon={<TrendingUp color={iconColor} size={20} />}
                title={t("notifications.progressNotifications", "İlerleme Bildirimleri")}
                isSwitch
                switchValue={progressNotificationsEnabled}
                onSwitchChange={setProgressNotificationsEnabled}
              />
            </>
          )}
        </SettingsSection>

        {/* Subscription Section */}
        <SettingsSection title={t("subscription.title")}>
          {!isConfigured ? (
            <XStack paddingVertical="$2" justifyContent="center">
              <Spinner color="$primary" />
            </XStack>
          ) : isPremium ? (
            <SettingsRow
              icon={
                <Crown
                  color={themeContext.warning10?.val || themeContext.yellow10?.val}
                  size={20}
                />
              }
              title={t("subscription.premium")}
              subtitle={t("subscription.premiumDesc")}
              actionText={
                customerInfo?.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID]?.expirationDate !== null
                  ? t("subscription.manage", "Aboneliği Yönet")
                  : undefined
              }
              onPress={
                customerInfo?.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID]?.expirationDate !== null
                  ? handleManageSubscription
                  : undefined
              }
            />
          ) : (
            <SettingsRow
              icon={<CreditCard color={iconColor} size={20} />}
              title={t("subscription.freePlan")}
              subtitle={t("subscription.freeDesc")}
              onPress={() => {
                if (!isSignedIn) {
                  router.push("/(auth)/login");
                } else {
                  router.push("/paywall");
                }
              }}
              actionText={t("subscription.upgrade")}
            />
          )}
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title={t("account.title")}>
          {isSignedIn && user ? (
            <>
              <SettingsRow
                icon={<User color={iconColor} size={20} />}
                title={
                  user.fullName ||
                  user.emailAddresses[0]?.emailAddress ||
                  "User"
                }
                subtitle={user.emailAddresses[0]?.emailAddress}
              />
              <Separator marginVertical="$2" borderColor="$borderColor" />
              <SettingsRow
                icon={<LogOut color={dangerColor} size={20} />}
                title={t("account.logout")}
                titleColor="$red10"
                onPress={handleLogout}
                loading={isProcessing}
              />
            </>
          ) : (
            <SettingsRow
              icon={<LogIn color={iconColor} size={20} />}
              title={
                t("account.loginOrRegister") !== "account.loginOrRegister"
                  ? t("account.loginOrRegister")
                  : "Giriş Yap veya Kayıt Ol"
              }
              onPress={() => {
                router.push("/(auth)/login");
              }}
            />
          )}
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title={t("dangerZone.title")} titleColor="$red10">
          <SettingsRow
            icon={<RotateCcw color={dangerColor} size={20} />}
            title={
              t("dangerZone.resetStats") !== "dangerZone.resetStats"
                ? t("dangerZone.resetStats")
                : "İstatistikleri Sıfırla"
            }
            titleColor="$red10"
            subtitle={
              t("dangerZone.resetStatsDesc") !== "dangerZone.resetStatsDesc"
                ? t("dangerZone.resetStatsDesc")
                : "Okuma geçmişini ve performans verilerini sil."
            }
            onPress={() => setResetStatsSheetOpen(true)}
          />
          {isSignedIn && (
            <>
              <Separator marginVertical="$2" borderColor="$borderColor" />
              <SettingsRow
                icon={<Trash2 color={dangerColor} size={20} />}
                title={
                  t("dangerZone.deleteAccount") !== "dangerZone.deleteAccount"
                    ? t("dangerZone.deleteAccount")
                    : "Hesabı Sil"
                }
                titleColor="$red10"
                subtitle={
                  t("dangerZone.deleteAccountDesc") !==
                  "dangerZone.deleteAccountDesc"
                    ? t("dangerZone.deleteAccountDesc")
                    : "Hesabını ve ilişkili verilerini kalıcı olarak sil."
                }
                onPress={() => setDeleteAccountSheetOpen(true)}
              />
            </>
          )}
        </SettingsSection>
      </ScrollView>

      {/* Theme Sheet */}
      <SelectionSheet
        open={themeSheetOpen}
        onOpenChange={setThemeSheetOpen}
        title={t("appearance.theme")}
        options={[
          {
            label: t("appearance.themeOptions.light"),
            value: "light",
            icon: <Sun size={20} color={iconColor} />,
          },
          {
            label: t("appearance.themeOptions.dark"),
            value: "dark",
            icon: <Moon size={20} color={iconColor} />,
          },
          {
            label: t("appearance.themeOptions.system"),
            value: "system",
            icon: <Monitor size={20} color={iconColor} />,
          },
        ]}
        currentValue={theme}
        onSelect={(v: any) => handleThemeChange(v as ThemeType)}
      />

      {/* Language Sheet */}
      <SelectionSheet
        open={langSheetOpen}
        onOpenChange={setLangSheetOpen}
        title={t("appearance.language")}
        options={[
          {
            label: t("appearance.languageOptions.tr"),
            value: "tr",
            icon: <Languages size={20} color={iconColor} />,
          },
        ]}
        currentValue={language}
        onSelect={(v: any) => handleLangChange(v as LanguageType)}
      />

      {/* Reset Stats Confirmation */}
      <ConfirmationSheet
        open={resetStatsSheetOpen}
        onOpenChange={setResetStatsSheetOpen}
        title={t("dangerZone.resetStats")}
        description={t("dangerZone.resetStatsConfirm")}
        confirmText={t("dangerZone.confirmReset")}
        cancelText={t("dangerZone.cancel")}
        onConfirm={handleResetStats}
        isProcessing={isProcessing}
        destructive
      />

      {/* Delete Account Confirmation */}
      <ConfirmationSheet
        open={deleteAccountSheetOpen}
        onOpenChange={setDeleteAccountSheetOpen}
        title={t("dangerZone.deleteAccount")}
        description={t("dangerZone.deleteAccountConfirm")}
        confirmText={t("dangerZone.confirmDelete")}
        cancelText={t("dangerZone.cancel")}
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

function SettingsSection({
  title,
  titleColor,
  children,
}: {
  title: string;
  titleColor?: any;
  children: React.ReactNode;
}) {
  return (
    <YStack marginBottom="$5">
      <AppText
        variant="caption"
        color={titleColor || "$color10"}
        marginBottom={8}
        marginLeft={8}
        textTransform="uppercase"
        fontWeight="bold"
      >
        {title}
      </AppText>
      <YStack
        backgroundColor="$backgroundHover"
        borderRadius="$4"
        padding="$3"
        overflow="hidden"
      >
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
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
}

function SettingsRow({
  icon,
  title,
  titleColor,
  subtitle,
  value,
  actionText,
  onPress,
  loading,
  isSwitch,
  switchValue,
  onSwitchChange,
}: SettingsRowProps) {
  const theme = useTheme();

  const isPressable = !!onPress && !actionText && !loading && !isSwitch;

  return (
    <XStack
      alignItems="center"
      gap="$3"
      paddingVertical="$2"
      opacity={loading ? 0.5 : 1}
      {...(isPressable
        ? { onPress, pressStyle: { opacity: 0.7 }, cursor: "pointer" as const }
        : {})}
    >
      {icon}
      <YStack flex={1} minWidth={0}>
        <SizableText
          size="$5"
          color={(titleColor || "$color") as any}
          fontFamily="$body"
        >
          {title}
        </SizableText>
        {subtitle ? (
          <SizableText
            size="$3"
            color="$color10"
            fontFamily="$body"
            marginTop={2}
          >
            {subtitle}
          </SizableText>
        ) : null}
      </YStack>
      {loading ? (
        <Spinner size="small" color={theme.color?.val} />
      ) : isSwitch ? (
        <YStack borderWidth={1} borderColor="$borderColor" borderRadius={20} padding={2}>
          <RNSwitch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: theme.backgroundHover?.val || "#767577", true: theme.accent10?.val || theme.primary?.val || "$green10" }}
            thumbColor={switchValue ? theme.background?.val || "#fff" : theme.color10?.val || "#f4f3f4"}
          />
        </YStack>
      ) : value ? (
        <XStack alignItems="center" gap="$2">
          <SizableText size="$4" color="$color10" fontFamily="$body">
            {value}
          </SizableText>
          <ChevronRight color={theme.color10?.val} size={20} />
        </XStack>
      ) : actionText ? (
        <AppButton size="$3" onPress={onPress}>
          {actionText}
        </AppButton>
      ) : onPress ? (
        <ChevronRight color={theme.color10?.val} size={20} />
      ) : null}
    </XStack>
  );
}

// -------------------------------------------------------------
// Sheets
// -------------------------------------------------------------

function SelectionSheet({
  open,
  onOpenChange,
  title,
  options,
  currentValue,
  onSelect,
}: any) {
  const theme = useTheme();
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      dismissOnSnapToBottom
      snapPoints={[40]}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <YStack gap="$4">
          <AppText
            variant="title"
            style={{ textAlign: "center", marginBottom: 8 }}
          >
            {title}
          </AppText>
          {options.map((opt: any) => (
            <Button
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              backgroundColor={
                currentValue === opt.value ? "$backgroundHover" : "transparent"
              }
              justifyContent="flex-start"
              padding="$3"
              borderWidth={0}
              icon={opt.icon}
            >
              <XStack
                flex={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <AppText fontSize="$5">{opt.label}</AppText>
                {currentValue === opt.value && (
                  <Check size={20} color={theme.accent10?.val || theme.primary?.val} />
                )}
              </XStack>
            </Button>
          ))}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

function ConfirmationSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  isProcessing,
  destructive,
}: any) {
  const theme = useTheme();
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      dismissOnSnapToBottom
      snapPoints={[35]}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <YStack gap="$4">
          <AppText
            variant="title"
            style={{
              textAlign: "center",
              color: destructive ? theme.red10?.val : theme.color?.val,
            }}
          >
            {title}
          </AppText>
          <AppText
            style={{
              textAlign: "center",
              color: theme.color10?.val,
              marginBottom: 16,
            }}
          >
            {description}
          </AppText>

          <YStack gap="$3">
            <AppButton
              btnType={destructive ? "secondary" : "primary"}
              backgroundColor={destructive ? "$red10" : undefined}
              color={destructive ? "white" : undefined}
              onPress={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? <Spinner color={theme.background?.val} /> : confirmText}
            </AppButton>
            <AppButton
              btnType="outline"
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
