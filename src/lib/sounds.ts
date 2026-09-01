import type { AudioPlayer } from 'expo-audio';
import { useSettingsStore } from '@/stores/settingsStore';

// Lazily created so the asset only loads once, on first use, mirroring the
// non-hook `haptics` module - this is called from useCreateSession (not a
// component render), where the useAudioPlayer() hook isn't usable.
//
// `expo-audio` is require()'d lazily inside this function rather than
// imported at module scope: useCreateSession (and therefore this module) is
// pulled in by every exercise engine's unit tests, and expo-audio's native
// binding isn't loadable in the bun test environment - a static import would
// break the whole engine test suite even though none of them trigger a
// difficulty change.
let difficultyChangePlayer: AudioPlayer | null = null;

function getDifficultyChangePlayer(): AudioPlayer | null {
  if (!difficultyChangePlayer) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createAudioPlayer } = require('expo-audio');
      difficultyChangePlayer = createAudioPlayer(require('@/assets/audio/zorluk.wav'));
    } catch {
      difficultyChangePlayer = null;
    }
  }
  return difficultyChangePlayer;
}

export const sounds = {
  difficultyChanged: () => {
    if (!useSettingsStore.getState().soundEnabled) return;
    try {
      const player = getDifficultyChangePlayer();
      if (player) {
        player.seekTo(0);
        player.play();
      }
    } catch {
      // Audio playback failure should never crash session creation or UI flow
    }
  },
};
