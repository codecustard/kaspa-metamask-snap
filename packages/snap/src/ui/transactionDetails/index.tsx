import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Divider,
  Bold,
  Copyable,
} from '@metamask/snaps-sdk/jsx';

interface TransactionDetailsProps {
  transaction: {
    transaction_id: string;
    block_time?: string;
    is_accepted?: boolean;
    inputs?: Array<{
      previous_outpoint_address?: string;
      previous_outpoint_amount?: string;
    }>;
    outputs?: Array<{
      script_public_key_address?: string;
      amount?: string;
    }>;
  };
  userAddress: string;
  showDebug?: boolean;
}

export function transactionDetails({ transaction, userAddress, showDebug = false }: TransactionDetailsProps) {
  // Calculate transaction direction and amounts
  let totalReceived = 0;
  let totalSent = 0;
  let hasIncomingOutput = false;
  let hasOutgoingInput = false;

  // Check outputs for incoming transactions
  if (transaction.outputs && Array.isArray(transaction.outputs)) {
    for (const output of transaction.outputs) {
      if (output.script_public_key_address === userAddress) {
        totalReceived += parseInt(output.amount || '0');
        hasIncomingOutput = true;
      }
    }
  }

  // Check inputs for outgoing transactions
  if (transaction.inputs && Array.isArray(transaction.inputs)) {
    for (const input of transaction.inputs) {
      if (input.previous_outpoint_address === userAddress) {
        hasOutgoingInput = true;
        totalSent += parseInt(input.previous_outpoint_amount || '0');
      }
    }
  }

  const isSent = hasOutgoingInput;
  const isReceived = hasIncomingOutput && !hasOutgoingInput;

  return (
    <Container>
      <Box direction="vertical">
        <Heading>Transaction Details</Heading>

        <Box direction="horizontal" alignment="center">
          <Button name="backToHome" variant="primary">
            Back to Home
          </Button>
        </Box>

        <Box direction="vertical">
          <Text>
            <Bold>Explorer Link:</Bold>
          </Text>
          <Copyable value={`https://explorer.hoosat.fi/txs/${transaction.transaction_id}`} />
        </Box>

        <Divider />

        <Box direction="vertical">
          <Text>
            <Bold>Transaction ID:</Bold>
          </Text>
          <Copyable value={transaction.transaction_id} />
        </Box>

        <Box direction="vertical">
          <Text>
            <Bold>Type:</Bold>
          </Text>
          <Text color={isReceived ? 'success' : 'error'}>
            {isReceived ? 'Received' : 'Sent'}
          </Text>
        </Box>

        {transaction.block_time && (
          <Box direction="vertical">
            <Text>
              <Bold>Date:</Bold>
            </Text>
            <Text>
              {new Date(transaction.block_time).toLocaleString()}
            </Text>
          </Box>
        )}

        <Box direction="vertical">
          <Text>
            <Bold>Status:</Bold>
          </Text>
          <Text color={transaction.is_accepted ? 'success' : 'warning'}>
            {transaction.is_accepted ? 'Confirmed' : 'Pending'}
          </Text>
        </Box>

        {isReceived && (
          <Box direction="vertical">
            <Text>
              <Bold>Amount Received:</Bold>
            </Text>
            <Text color="success">
              +{(totalReceived / 100000000).toFixed(8)} HTN
            </Text>
          </Box>
        )}

        {isSent && (
          <Box direction="vertical">
            <Text>
              <Bold>Amount Sent:</Bold>
            </Text>
            <Text color="error">
              -{Math.abs((totalSent - totalReceived) / 100000000).toFixed(8)} HTN
            </Text>
          </Box>
        )}

        <Divider />

        <Box direction="horizontal" alignment="center">
          <Button name={showDebug ? 'hideDebug' : 'showDebug'} variant="primary">
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </Button>
        </Box>

        {showDebug && (
          <Box direction="vertical">
            <Text>
              <Bold>Debug - Input Structure:</Bold>
            </Text>
            <Text color="alternative" size="sm">
              {JSON.stringify(transaction.inputs?.[0] || 'No inputs', null, 2)}
            </Text>

            <Text>
              <Bold>Debug - Output Structure:</Bold>
            </Text>
            <Text color="alternative" size="sm">
              {JSON.stringify(transaction.outputs?.[0] || 'No outputs', null, 2)}
            </Text>
          </Box>
        )}

        <Divider />
      </Box>
    </Container>
  );
}