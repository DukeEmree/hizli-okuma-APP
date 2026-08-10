import { useSyncStore } from "@/stores/syncStore";
import { PendingSession } from "@/stores/syncStore";

export function useCreateSession() {
  const addSession = useSyncStore((state) => state.addSession);

  return async (args: any) => {
    // Add to sync queue immediately
    addSession(args);
    // Return a dummy session ID since it will be synced later
    return { sessionId: 'offline-pending', gamification: null };
  };
}
