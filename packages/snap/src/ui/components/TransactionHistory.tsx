
import {
  Box,
  Text,
  Bold,
  Divider,
  Button,
  SnapComponent,
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

export const TransactionHistory: SnapComponent<Props> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Box direction="vertical" alignment="center">
        <Text color="muted" alignment="center">
          No recent transactions
        </Text>
        <Text color="alternative" alignment="center">
          Pending transactions from the mempool will appear here
        </Text>
      </Box>
    );
  }

  const txElements = [];
  const txsToShow = transactions.slice(0, 4);

  for (let i = 0; i < txsToShow.length; i++) {
    const tx = txsToShow[i]!;

    txElements.push(
      <Box key={`tx-${i}`} direction="horizontal" alignment="space-between">
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
    );

    if (i < txsToShow.length - 1) {
      txElements.push(<Divider />);
    }
  }

  return (
    <Box direction="vertical">
      {txElements}
    </Box>
  );
};