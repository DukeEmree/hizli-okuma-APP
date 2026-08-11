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

export function setSentryUser(userId: string | null) {
  if (__DEV__) {
    console.log(`[Sentry SetUser] userId: ${userId}`);
    return;
  }
  
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }
}
