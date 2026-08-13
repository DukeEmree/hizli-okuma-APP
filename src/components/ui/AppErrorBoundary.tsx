import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ErrorBoundaryProps } from "expo-router";
import i18n from "@/i18n";
import { captureException } from "@/lib/sentry";

/**
 * Fallback UI for a render-time throw, wired to Expo Router's per-segment
 * `ErrorBoundary` export.
 *
 * Deliberately built from React Native primitives and `useColorScheme`
 * instead of Tamagui tokens and `useTranslation`: this renders *because*
 * something in the tree below already failed, and the provider that failed
 * may well be the theme or i18n provider itself. Anything this component
 * depends on is a way for the error screen to throw too, which would leave
 * the user with a blank app and no route back.
 */
export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    // The boundary swallows the throw, so without this the crash never
    // reaches Sentry - it stops being a fatal and becomes an invisible one.
    captureException(error, { context: "AppErrorBoundary" });
  }, [error]);

  const palette = isDark
    ? { bg: "#101211", fg: "#F2F4F3", muted: "#9BA5A0", accent: "#2DBE73", onAccent: "#04170D" }
    : { bg: "#FFFFFF", fg: "#101211", muted: "#5F6B65", accent: "#2DBE73", onAccent: "#04170D" };

  // i18n may itself be the thing that broke; fall back to literals so the
  // screen is never a wall of raw translation keys.
  const t = (key: string, fallback: string) => {
    try {
      const value = i18n.t(key, { ns: "errors", defaultValue: fallback });
      return typeof value === "string" ? value : fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.bg,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <Text style={[styles.title, { color: palette.fg }]}>
        {t("boundary.title", "Bir şeyler ters gitti")}
      </Text>
      <Text style={[styles.body, { color: palette.muted }]}>
        {t(
          "boundary.body",
          "Beklenmeyen bir hata oluştu. Tekrar denemek bu ekranı yeniden yükler; ilerlemen cihazında kayıtlı kaldı.",
        )}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("boundary.retry", "Tekrar Dene")}
        onPress={() => {
          retry();
        }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: palette.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buttonLabel, { color: palette.onAccent }]}>
          {t("boundary.retry", "Tekrar Dene")}
        </Text>
      </Pressable>

      {/* The raw message is developer-facing only: in production the user
          gets the copy above and Sentry gets the stack. */}
      {__DEV__ && (
        <Text style={[styles.debug, { color: palette.muted }]}>{String(error?.message ?? error)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  debug: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
  },
});
