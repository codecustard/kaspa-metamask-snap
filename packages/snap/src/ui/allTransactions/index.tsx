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
  currentPage?: number;
  [key: string]: any;
}

export function allTransactions({ transactions, currentPage = 1 }: Props) {
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);
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
            <Box direction="horizontal" alignment="space-between">
              <Text color="alternative">
                Showing {(startIndex + 1).toString()}-{Math.min(endIndex, transactions.length).toString()} of {transactions.length.toString()} transactions
              </Text>
              <Text color="alternative">
                Page {currentPage.toString()} of {totalPages.toString()}
              </Text>
            </Box>

            {currentTransactions.map((tx, index) => (
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
                {index < currentTransactions.length - 1 && <Divider />}
              </Box>
            ))}

            {totalPages > 1 && (
              <Box direction="vertical">
                <Divider />
                <Box direction="horizontal" alignment="space-between">
                  <Button
                    name="firstPage"
                    variant={currentPage > 1 ? "primary" : "destructive"}
                    disabled={currentPage <= 1}
                  >
                    First
                  </Button>
                  <Button
                    name="previousPage"
                    variant={currentPage > 1 ? "primary" : "destructive"}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <Text color="alternative">
                    Page {currentPage.toString()} of {totalPages.toString()}
                  </Text>
                  <Button
                    name="nextPage"
                    variant={currentPage < totalPages ? "primary" : "destructive"}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    name="lastPage"
                    variant={currentPage < totalPages ? "primary" : "destructive"}
                    disabled={currentPage >= totalPages}
                  >
                    Last
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};