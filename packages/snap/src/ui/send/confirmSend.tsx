
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Bold,
  Divider,
} from '@metamask/snaps-sdk/jsx';

import { sendTransaction } from '../../rpc/sendTransaction';

export async function confirmSend(
  id: string,
  recipient: string,
  amount: string
) {
  try {
    const result = await sendTransaction({ to: recipient, amount });

    if (result.success) {
      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Container>
              <Box>
                <Heading>Transaction Sent!</Heading>
                <Text>Your transaction has been successfully submitted to the network.</Text>

                <Divider />

                <Text>
                  <Bold>Transaction ID:</Bold>
                </Text>
                <Text>{result.txId}</Text>

                <Divider />

                <Text>
                  <Bold>Amount:</Bold> {amount} HTN
                </Text>
                <Text>
                  <Bold>To:</Bold> {recipient}
                </Text>

                <Divider />

                <Button name="backToHome">Back to Home</Button>
              </Box>
            </Container>
          ),
        },
      });
    } else {
      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Container>
              <Box>
                <Heading>Transaction Failed</Heading>
                <Text>The transaction could not be completed.</Text>

                <Divider />

                <Text>
                  <Bold>Error:</Bold>
                </Text>
                <Text>{result.error}</Text>

                <Divider />

                <Button name="send">Try Again</Button>
                <Button name="backToHome">Back to Home</Button>
              </Box>
            </Container>
          ),
        },
      });
    }
  } catch (error) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Container>
            <Box>
              <Heading>Transaction Error</Heading>
              <Text>An unexpected error occurred while processing the transaction.</Text>

              <Divider />

              <Text>
                <Bold>Error:</Bold>
              </Text>
              <Text>{error instanceof Error ? error.message : 'Unknown error'}</Text>

              <Divider />

              <Button name="send">Try Again</Button>
              <Button name="backToHome">Back to Home</Button>
            </Box>
          </Container>
        ),
      },
    });
  }
}