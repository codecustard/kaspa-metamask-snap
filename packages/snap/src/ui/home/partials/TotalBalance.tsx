import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Heading, Button, Icon } from '@metamask/snaps-sdk/jsx';

type Props = {
  balance: string;
  hideBalance?: boolean;
  [key: string]: any;
};

export const TotalBalance: SnapComponent<Props> = ({
  balance,
  hideBalance,
}) => {
  const balanceNumber = parseFloat(balance);
  const formattedBalance = balanceNumber.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });

  return (
    <Box direction="vertical" alignment="start">
      <Box direction="horizontal" alignment="center">
        <Heading size="lg">
          {hideBalance ? '●●●●●●●●' : `${formattedBalance} HTN`}
        </Heading>
        <Button name={hideBalance ? 'showBalance' : 'hideBalance'}>
          <Icon
            name={hideBalance ? 'eye-slash' : 'eye'}
            size="md"
            color="muted"
          />
        </Button>
      </Box>
      {/* <Text color="alternative">
        {hideBalance ? '••••••••' : 'Hoosat Network'}
      </Text> */}
    </Box>
  );
};
