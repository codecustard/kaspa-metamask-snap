import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  Divider,
} from '@metamask/snaps-sdk/jsx';

/**
 * Display send transaction form interface
 *
 * @param id - Interface ID for the snap
 */
export async function send(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Container>
          <Box>
            <Heading>Send HTN</Heading>
            <Text>Send Hoosat tokens to another address</Text>

            <Divider />

            <Text>Recipient Address:</Text>
            <Input name="recipient" placeholder="hoosat:qr..." />

            <Text>Amount (HTN):</Text>
            <Input name="amount" placeholder="0.00000000" />

            <Divider />

            <Button name="sendReview">Review Transaction</Button>
            <Button name="backToHome">Cancel</Button>
          </Box>
        </Container>
      ),
    },
  });
}
