import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Icon,
  Copyable,
} from '@metamask/snaps-sdk/jsx';

import { TotalBalance } from './partials/TotalBalance';
import { CTA } from '../components/CTA';
import { TransactionHistory } from '../components/TransactionHistory';

type HomeProps = {
  balance: string;
  address: string;
  hideBalance?: boolean;
  transactions?: any[];
  debugMessage?: string;
  shouldSuggestCompound?: boolean;
  utxoCount?: number;
  [key: string]: any;
};

/**
 * Display home page interface
 *
 * @param props - Home component properties
 * @returns JSX element for home page
 */
export function home(props: HomeProps) {
  const {
    balance,
    address,
    hideBalance = false,
    transactions = [],
    shouldSuggestCompound = false,
    utxoCount = 0,
  } = props;

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
        {hideBalance ? (
          <Text color="alternative">
            ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
          </Text>
        ) : (
          <Copyable value={address} />
        )}

        {shouldSuggestCompound && (
          <Box direction="vertical" alignment="center">
            <Text color="error">
              Too many UTXOs detected ({utxoCount.toString()})!
            </Text>
            <Text color="alternative">
              Consider compounding to improve transaction efficiency
            </Text>
            <Button name="compoundUTXOs" variant="destructive">
              Compound UTXOs
            </Button>
          </Box>
        )}

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
      </Box>
    </Container>
  );
}
