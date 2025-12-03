
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
} from '@metamask/snaps-sdk/jsx';

import { getWallet } from '../util/wallet';
import { getUtxos } from '../rpc/getUtxos';
import { utxosPage } from './utxos/index';

export async function viewUTXOs(id: string) {
  let step = 'Starting';
  try {
    // Step by step debugging
    step = 'Getting wallet';
    const wallet = await getWallet();

    step = 'Getting UTXOs';
    const utxosResult = await getUtxos(wallet.address);

    step = 'Creating UI';
    const ui = utxosPage({
      utxos: utxosResult.utxos,
      address: wallet.address,
    });

    step = 'Updating interface';
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui,
      },
    });
  } catch (error) {
    // Show detailed error info
    let errorMessage = 'Unknown error';
    let errorStack = 'N/A';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack?.substring(0, 200) || 'N/A';
    } else {
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = String(error);
      }
    }

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Container>
            <Box>
              <Heading>UTXOs Error</Heading>
              <Text>Step: {step}</Text>
              <Text>Error: {errorMessage}</Text>
              <Text>Stack: {errorStack}</Text>
              <Button name="goBack">Go Back</Button>
            </Box>
          </Container>
        ),
      },
    });
  }
}