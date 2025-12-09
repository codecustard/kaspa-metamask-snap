import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Divider,
  Copyable,
} from '@metamask/snaps-sdk/jsx';

import { getWallet } from '../../util/wallet';

/**
 * Display receive address interface
 *
 * @param id - Interface ID for the snap
 */
export async function receive(id: string) {
  let address = 'hoosat:qr1234567890abcdef1234567890abcdef12345678';

  try {
    const wallet = await getWallet();
    address = wallet.address;
  } catch {
    // Failed to get wallet address
  }

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Container>
          <Box>
            <Heading>Receive HTN</Heading>
            <Text>Share this address to receive Hoosat tokens</Text>

            <Divider />

            <Text>Your Address:</Text>
            <Copyable value={address} />

            <Divider />

            <Text>
              Send this address to the person who wants to send you HTN tokens.
              Make sure to double-check the address before sharing it.
            </Text>

            <Divider />

            <Button name="backToHome">Back to Home</Button>
          </Box>
        </Container>
      ),
    },
  });
}
