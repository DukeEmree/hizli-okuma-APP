import { Button, styled } from 'tamagui';

export const AppIconButton = styled(Button, {
  name: 'AppIconButton',
  circular: true,
  size: '$4',
  backgroundColor: 'transparent',
  transition: 'quick',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
});
