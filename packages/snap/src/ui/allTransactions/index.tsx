import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Bold,
  Divider,
} from '@metamask/snaps-sdk/jsx';

interface Transaction {
  txid: string;
  amount: string;
  type: 'received' | 'sent';
  timestamp: number;
}

interface Props {
  transactions: Transaction[];
  [key: string]: any;
}

export function allTransactions({ transactions }: Props) {
  return (
    <Container>
      <Box direction="vertical">
        <Heading>Transaction History</Heading>

        <Box direction="horizontal" alignment="center">
          <Button name="backToHome" variant="primary">
            Back to Home
          </Button>
        </Box>

        <Divider />

        {!transactions || transactions.length === 0 ? (
          <Box direction="vertical" alignment="center">
            <Text color="muted" alignment="center">
              No transactions found
            </Text>
            <Text color="alternative" alignment="center">
              Transactions will appear here when you send or receive HTN
            </Text>
          </Box>
        ) : (
          <Box direction="vertical">
            <Text color="alternative">
              Showing {transactions.length.toString()} transactions
            </Text>

            {transactions.map((tx, index) => (
              <Box key={`tx-${index}`} direction="vertical">
                <Box direction="horizontal" alignment="space-between">
                  <Box direction="horizontal">
                    <Box direction="vertical" alignment="start">
                      <Text color={tx.type === 'received' ? 'success' : 'error'}>
                        <Bold>
                          {tx.type === 'received' ? '+' : '-'}
                          {parseFloat(tx.amount).toFixed(8)} HTN
                        </Bold>
                      </Text>
                      <Text color={tx.type === 'received' ? 'success' : 'error'}>
                        {tx.type === 'received' ? 'Received' : 'Sent'}
                      </Text>
                    </Box>
                  </Box>
                  <Box direction="vertical" alignment="end">
                    <Text color="alternative">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </Text>
                    <Button name={`viewTransaction:${tx.txid}`}>
                      {tx.txid.slice(0, 12)}...
                    </Button>
                  </Box>
                </Box>
                {index < transactions.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};