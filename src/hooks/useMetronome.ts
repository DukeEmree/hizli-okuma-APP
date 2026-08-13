import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSettingsStore } from '@/stores/settingsStore';

// Metronome is just an on/off tick source - tempo is driven entirely by
// whatever calls playTick() (once per on-screen word), there is no
// independent bpm-interval to start/stop.
export function useMetronome() {
  const isEnabled = useSettingsStore(state => state.metronomeEnabled);
  const setMetronomeEnabled = useSettingsStore(state => state.setMetronomeEnabled);

  // Load the tick sound (ensure the path exists)
  const player = useAudioPlayer(require('@/assets/audio/tick.wav'));

  const playTick = useCallback(() => {
    if (player) {
      player.seekTo(0);
      player.play();
    }
  }, [player]);

  const stop = useCallback(() => {
    // Unmount can race with expo-audio's own release effect (both fire on
    // exit), so the native player may already be released here - ignore.
    try {
      player?.pause();
    } catch {
      // no-op
    }
  }, [player]);

  const toggleEnabled = useCallback(() => {
    setMetronomeEnabled(!isEnabled);
  }, [isEnabled, setMetronomeEnabled]);

  return {
    isEnabled,
    toggleEnabled,
    stop,
    playTick
  };
}
