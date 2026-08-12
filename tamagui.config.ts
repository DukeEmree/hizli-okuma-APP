import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v5'
import { animations } from '@tamagui/config/v5-reanimated'
import { themes as customThemes } from './src/config/tamagui/themes'
import { shorthands } from '@tamagui/shorthands'

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  shorthands,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
  animations,
  themes: customThemes,
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
