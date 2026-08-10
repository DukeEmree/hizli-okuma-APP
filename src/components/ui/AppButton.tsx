import { Button, styled } from 'tamagui';

export const AppButton = styled(Button, {
  name: 'AppButton',
  backgroundColor: '$blue10',
  color: 'white',
  hoverStyle: {
    backgroundColor: '$blue11',
  },
  pressStyle: {
    backgroundColor: '$blue9',
  },
  variants: {
    btnType: {
      primary: {
        backgroundColor: '$blue10',
      },
      secondary: {
        backgroundColor: '$gray5',
        color: '$color',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$blue10',
        color: '$blue10',
      },
    },
  } as const,
  defaultVariants: {
    btnType: 'primary',
  },
});
