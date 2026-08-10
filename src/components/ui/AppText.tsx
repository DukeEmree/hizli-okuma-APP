import { Text, styled } from 'tamagui';

export const AppText = styled(Text, {
  name: 'AppText',
  color: '$color',
  fontFamily: '$body',
  variants: {
    variant: {
      title: {
        fontSize: '$8',
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: '$6',
        fontWeight: '600',
        color: '$color11',
      },
      body: {
        fontSize: '$4',
      },
      caption: {
        fontSize: '$2',
        color: '$color10',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'body',
  },
});
