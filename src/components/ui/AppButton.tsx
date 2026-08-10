import { Button, styled } from 'tamagui';

export const AppButton = styled(Button, {
  name: 'AppButton',
  backgroundColor: '$blue10Light',
  color: 'white',
  hoverStyle: {
    backgroundColor: '$blue11Light',
  },
  pressStyle: {
    backgroundColor: '$blue9Light',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '$blue10Light',
      },
      secondary: {
        backgroundColor: '$gray5Light',
        color: '$color',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$blue10Light',
        color: '$blue10Light',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'primary',
  },
});
