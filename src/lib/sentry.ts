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
    // Add any routing/tracing integrations here if needed.
    // For now, basic error and crash tracking.
    tracesSampleRate: 1.0,
    _experiments: {
      // ProfilesSampleRate is optional
      profilesSampleRate: 1.0,
    },
  });
}

// Utility wrapper to catch and log errors
export function captureException(
  error: unknown,
  context?: Record<string, any>,
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
