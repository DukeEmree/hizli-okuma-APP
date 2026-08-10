import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { setActiveUserId } from "@/stores/storage";

export function AuthSync() {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn && userId) {
      // Convex tarafında kullanıcıyı kaydet veya güncelle
      storeUser().catch(err => console.error('Failed to sync user to Convex:', err));
      // Local storage izole işlemi için user id ayarla
      setActiveUserId(userId);
    } else {
      setActiveUserId(null);
    }
  }, [isLoaded, isSignedIn, userId, storeUser]);

  return null;
}
