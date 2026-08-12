import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Separator,
  Sheet,
  SizableText,
  Spinner,
  Switch,
  Text,
  useTheme,
  XStack,
  YStack,
} from "tamagui";

import { useRevenueCat } from "@/providers/RevenueCatProvider";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { useGamificationStore } from "@/stores/gamificationStore";
import {
  LanguageType,
  ThemeType,
  useSettingsStore,
} from "@/stores/settingsStore";
import { useStreakCacheStore } from "@/stores/streakCacheStore";
import { useStatisticsStore } from "@/stores/useStatisticsStore";
import { useLocalHistoryStore } from "@/stores/localHistoryStore";
import { useUserProgressStore } from "@/stores/userProgressStore";

import {
  Check,
  ChevronRight,
  CreditCard,
  Crown,
  Languages,
  Monitor,
  Moon,
  RotateCcw,
  Sun,
  Bell,
  Clock,
  Flame,
  TrendingUp,
} from "lucide-react-native";
import { requestNotificationPermissions, rescheduleAllReminders, scheduleWeeklySummaryNotification } from '@/services/notifications';
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

  // States for Sheets and Pickers
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [resetStatsSheetOpen, setResetStatsSheetOpen] = useState(false);
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
    scheduleWeeklySummaryNotification().catch(console.error);
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

  const handleResetStats = () => {
    setIsProcessing(true);
    try {
      useExerciseProgressStore.getState().resetAll();
      useStatisticsStore.getState().invalidate();
      useUserProgressStore.getState().resetProgress();
      useStreakCacheStore.getState().resetCache();
      useGamificationStore.getState().resetProgress();
      useLocalHistoryStore.getState().clear();

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

  const handleManageSubscription = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (error) {
      console.error("Customer Center error:", error);
      Alert.alert("Hata", t("subscription.errorCustomerCenter", "Abonelik yönetimi şu anda açılamıyor. Lütfen tekrar deneyin."));
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
          <Text fontSize="$8" fontWeight="bold" color="$color" fontFamily="$body">{t("title")}</Text>
          <Text fontSize="$2" color="$color10" fontFamily="$body">
            {t("subtitle")}
          </Text>
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
                onSwitchChange={(val) => {
                  setProgressNotificationsEnabled(val);
                  scheduleWeeklySummaryNotification().catch(console.error);
                }}
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
              onPress={() => router.push("/paywall")}
              actionText={t("subscription.upgrade")}
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
      <Text
        fontSize="$2"
        fontFamily="$body"
        color={titleColor || "$color10"}
        marginBottom={8}
        marginLeft={8}
        textTransform="uppercase"
        fontWeight="bold"
      >
        {title}
      </Text>
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
        <Switch
          size="$3"
          checked={switchValue}
          onCheckedChange={onSwitchChange}
          backgroundColor={switchValue ? "$accent10" : "$backgroundHover"}
        >
          <Switch.Thumb backgroundColor="$background" />
        </Switch>
      ) : value ? (
        <XStack alignItems="center" gap="$2">
          <SizableText size="$4" color="$color10" fontFamily="$body">
            {value}
          </SizableText>
          <ChevronRight color={theme.color10?.val} size={20} />
        </XStack>
      ) : actionText ? (
        <Button
          size="$3"
          backgroundColor="$green10"
          color="white"
          hoverStyle={{ backgroundColor: '$green11' }}
          pressStyle={{ backgroundColor: '$green9' }}
          onPress={onPress}
        >
          {actionText}
        </Button>
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
          <Text
            fontSize="$8"
            fontWeight="bold"
            color="$color"
            fontFamily="$body"
            style={{ textAlign: "center", marginBottom: 8 }}
          >
            {title}
          </Text>
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
                <Text fontSize="$5" color="$color" fontFamily="$body">{opt.label}</Text>
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
          <Text
            fontSize="$8"
            fontWeight="bold"
            color="$color"
            fontFamily="$body"
            style={{
              textAlign: "center",
              color: destructive ? theme.red10?.val : theme.color?.val,
            }}
          >
            {title}
          </Text>
          <Text
            fontSize="$4"
            color="$color"
            fontFamily="$body"
            style={{
              textAlign: "center",
              color: theme.color10?.val,
              marginBottom: 16,
            }}
          >
            {description}
          </Text>

          <YStack gap="$3">
            <Button
              backgroundColor={destructive ? "$red10" : "$green10"}
              color="white"
              hoverStyle={{ backgroundColor: '$green11' }}
              pressStyle={{ backgroundColor: '$green9' }}
              onPress={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? <Spinner color={theme.background?.val} /> : confirmText}
            </Button>
            <Button
              backgroundColor="transparent"
              color="$green10"
              borderWidth={1}
              borderColor="$green10"
              hoverStyle={{ backgroundColor: '$green11' }}
              pressStyle={{ backgroundColor: '$green9' }}
              onPress={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              {cancelText}
            </Button>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
