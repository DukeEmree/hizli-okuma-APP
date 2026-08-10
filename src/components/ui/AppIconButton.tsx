import { Button, styled } from 'tamagui';

export const AppIconButton = styled(Button, {
  name: 'AppIconButton',
  circular: true,
  size: '$4',
  backgroundColor: 'transparent',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
});
