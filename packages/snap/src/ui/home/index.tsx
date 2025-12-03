
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Icon,
} from '@metamask/snaps-sdk/jsx';

import { TotalBalance } from './partials/TotalBalance';
import { CTA } from '../components/CTA';
import { TransactionHistory } from '../components/TransactionHistory';

interface HomeProps {
  balance: string;
  address: string;
  hideBalance?: boolean;
  transactions?: any[];
  debugMessage?: string;
  [key: string]: any;
}

export function home(props: HomeProps) {
  const { balance, address, hideBalance = false, transactions = [], debugMessage } = props;

  return (
    <Container>
      <Box>
        <TotalBalance balance={balance} hideBalance={hideBalance} />

        {/* {debugMessage ? (
          <Text color="muted" size="sm">Debug: {debugMessage}</Text>
        ) : null} */}

        {/* <Box direction="vertical" alignment="center">
          <Heading size="md">Address</Heading>
        </Box> */}
        <Text color="alternative">
          {hideBalance ? '●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●' : address}
        </Text>

        <Box direction="horizontal" alignment="space-around">
          <CTA icon="wallet" name="send" label="Send" />
          <CTA icon="qr-code" name="receive" label="Receive" />
          <CTA icon="coin" name="viewUTXOs" label="UTXOs" />
          <CTA icon="refresh" name="refreshBalances" label="Refresh" />
        </Box>

        <Box direction="horizontal" alignment="space-between">
          <Heading size="md">Recent Transactions</Heading>
          <Button name="viewAllTransactions" variant="primary">
            <Icon color="primary" name="arrow-right" />
          </Button>
        </Box>

        <TransactionHistory transactions={transactions} />

        <Box direction="horizontal" alignment="space-between">
          <Box direction="vertical" alignment="center">
            <Text color="alternative">Network</Text>
            <Text>Mainnet</Text>
          </Box>
          <Box direction="vertical" alignment="center">
            <Text color="alternative">Block Height</Text>
            <Text>Latest</Text>
          </Box>
          <Box direction="vertical" alignment="center">
            <Text color="alternative">Confirmations</Text>
            <Text>6+</Text>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}