import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v5'
import { config as v3Config } from '@tamagui/config/v3'
import { themes as customThemes } from './src/config/tamagui/themes'
import { shorthands } from '@tamagui/shorthands'

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  shorthands,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
  animations: v3Config.animations,
  themes: customThemes,
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
