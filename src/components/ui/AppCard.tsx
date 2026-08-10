import { Card, styled } from 'tamagui';

export const AppCard = styled(Card, {
  name: 'AppCard',
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 2,
});
