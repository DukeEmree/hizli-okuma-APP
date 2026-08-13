import * as Sentry from "@sentry/react-native";

export function initSentry() {
  if (__DEV__) {
    console.log("Sentry disabled in DEV mode.");
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn("No Sentry DSN provided. Sentry disabled.");
    return;
  }

  Sentry.init({
    dsn,
    // Set from the EAS build profile (eas.json sets EXPO_PUBLIC_APP_VARIANT
    // per profile), so development/preview/production builds don't all land
    // in one undifferentiated bucket in the Sentry UI. `release` and `dist`
    // are filled in automatically by the @sentry/react-native/expo plugin
    // from the native build, so they are deliberately not set here.
    environment: process.env.EXPO_PUBLIC_APP_VARIANT ?? "production",
    // The app has no accounts and collects no personal data; make sure the
    // SDK doesn't attach IP addresses or request bodies on its own.
    sendDefaultPii: false,
    // Errors/crashes are always captured; only performance traces are
    // sampled. 100% tracing in production burns the Sentry quota on a
    // consumer app and adds per-transaction overhead on the JS thread,
    // so keep a representative 20% sample instead.
    tracesSampleRate: 0.2,
    _experiments: {
      profilesSampleRate: 0.2,
    },
  });
}

// Utility wrapper to catch and log errors
export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
) {
  if (__DEV__) {
    console.error("Captured Exception (DEV):", error, context);
  } else {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }
}

/**
 * Reports a non-fatal condition that isn't an thrown error - e.g. a missing
 * build-time configuration value that silently degrades a feature.
 */
export function captureMessage(
  message: string,
  context?: Record<string, unknown>,
) {
  if (__DEV__) {
    console.warn("Captured Message (DEV):", message, context);
    return;
  }
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureMessage(message, "warning");
  });
}
