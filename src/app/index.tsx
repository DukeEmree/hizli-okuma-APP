import { LoadingState } from "@/components/ui/LoadingState";

// Root gate: RootNavigation (src/app/_layout.tsx) replaces this with the
// correct destination ((onboarding) or (app)) once the local onboarding flag
// is read. Without an explicit "/" route, Expo Router falls back to an
// arbitrary group index (e.g. onboarding), causing it to flash on every app
// open.
export default function RootIndex() {
  return <LoadingState />;
}
