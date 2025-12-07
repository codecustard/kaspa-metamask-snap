import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Bold,
  Divider,
} from '@metamask/snaps-sdk/jsx';

/**
 * Display transaction review before confirmation
 *
 * @param id - Interface ID for the snap
 * @param recipient - Recipient address for the transaction
 * @param amount - Amount to send
 * @param senderAddress - Sender address for the transaction
 */
export async function reviewSend(
  id: string,
  recipient: string,
  amount: string,
  senderAddress: string,
) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Container>
          <Box>
            <Heading>Review Transaction</Heading>
            <Text>Please review the transaction details below</Text>

            <Divider />

            <Text>
              <Bold>Amount:</Bold> {amount} HTN
            </Text>

            <Divider />

            <Text>
              <Bold>From:</Bold>
            </Text>
            <Text>{senderAddress}</Text>

            <Divider />

            <Text>
              <Bold>To:</Bold>
            </Text>
            <Text>{recipient}</Text>

            <Divider />

            <Text>
              <Bold>Network Fee:</Bold> ~0.005 HTN
            </Text>

            <Divider />

            <Text>
              <Bold>Total:</Bold> {(parseFloat(amount) + 0.005).toFixed(8)} HTN
            </Text>

            <Divider />

            <Button name="sendConfirm">Confirm Transaction</Button>
            <Button name="send">Back to Edit</Button>
          </Box>
        </Container>
      ),
      context: {
        recipient,
        amount,
        senderAddress,
      },
    },
  });
}
