
import type { OnUserInputHandler } from '@metamask/snaps-sdk';
import { UserInputEventType } from '@metamask/snaps-sdk';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
} from '@metamask/snaps-sdk/jsx';
import { send, receive, reviewSend, confirmSend, home, viewUTXOs } from '../ui';
import { getWallet } from '../util/wallet';
import { getTransactions } from '../rpc/getTransactions';
import { HoosatUtils } from 'hoosat-sdk-web';
import { client } from '../util/client';

async function refreshHomePage(id: string, hideBalance = false) {
  let balance = '0.00000000';
  let address = 'hoosat:qr1234567890abcdef1234567890abcdef12345678';

  try {
    const wallet = await getWallet();
    address = wallet.address;

    try {
      const balanceResult = await client.getBalance(address);

      if (balanceResult && typeof balanceResult.balance !== 'undefined') {
        const balanceAmount = HoosatUtils.sompiToAmount(balanceResult.balance);
        balance = balanceAmount.toString();
      }
    } catch (balanceError) {
      console.error('Balance error:', balanceError);
    }
  } catch (walletError) {
    console.error('Wallet error:', walletError);
  }

  // Get transaction history
  const transactionHistory = await getTransactions();

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: home({
        balance,
        address,
        hideBalance,
        transactions: transactionHistory.transactions,
        debugMessage: `Refreshed at ${new Date().toLocaleTimeString()}`,
      }),
    },
  });
}

export const onUserInput: OnUserInputHandler = async ({ id, event, context }) => {
  console.log('onUserInput called with event:', event.name, 'type:', event.type);

  if (event.type === UserInputEventType.ButtonClickEvent || event.type === UserInputEventType.InputChangeEvent) {

    // Get form state from interface
    const state = await snap.request({
      method: 'snap_getInterfaceState',
      params: { id },
    });

    switch (event.name) {
      case 'send':
        await send(id);
        break;

      case 'receive':
        await receive(id);
        break;

      case 'sendReview':
        {
          const recipient = state.recipient as string;
          const amount = state.amount as string;

          if (!recipient || !amount) {
            // Stay on send page if form is incomplete
            await send(id);
            break;
          }

          const wallet = await getWallet();
          await reviewSend(id, recipient, amount, wallet.address);
          break;
        }

      case 'sendConfirm':
        {
          const recipient = (context?.recipient || state.recipient) as string;
          const amount = (context?.amount || state.amount) as string;

          await confirmSend(id, recipient, amount);
          break;
        }

      case 'backToHome':
      case 'refreshBalances':
        // Refresh home page with updated balance
        await refreshHomePage(id);
        break;

      case 'hideBalance':
      case 'showBalance':
        // Toggle balance visibility and refresh
        await refreshHomePage(id, event.name === 'hideBalance');
        break;

      case 'viewAllTransactions':
        // Refresh home page with updated transactions
        await refreshHomePage(id);
        break;

      case 'viewUTXOs':
        await viewUTXOs(id);
        break;

      case 'refreshUTXOs':
        await viewUTXOs(id);
        break;

      case 'goBack':
        // Go back to home page
        await refreshHomePage(id);
        break;

      case 'settings':
        // TODO: Implement these features
        console.log(`${event.name} clicked - not yet implemented`);
        break;

      default:
        // Check if it's a UTXO view event
        if (event.name?.startsWith('viewUTXO:')) {
          const eventData = event.name.substring(9); // Remove 'viewUTXO:' prefix
          const parts = eventData.split(':');
          const txId = parts[0];
          const index = parts[1];
          // Address might contain colons, so join everything after index
          const address = parts.slice(2).join(':');

          const txExplorerUrl = `https://explorer.hoosat.fi/txs/${txId}`;
          const addressExplorerUrl = `https://explorer.hoosat.fi/addresses/${address}`;

          // Show both explorer links
          await snap.request({
            method: 'snap_updateInterface',
            params: {
              id,
              ui: (
                <Container>
                  <Box>
                    <Heading>UTXO Details</Heading>

                    <Text>Transaction Explorer:</Text>
                    <Text color="alternative" size="sm">
                      {txExplorerUrl}
                    </Text>

                    <Text>Address Explorer:</Text>
                    <Text color="alternative" size="sm">
                      {addressExplorerUrl}
                    </Text>

                    <Text>TX ID: {txId || 'Unknown'}</Text>
                    <Text>Index: {index || 'Unknown'}</Text>

                    <Button name="goBack" variant="primary">Go Back</Button>
                  </Box>
                </Container>
              ),
            },
          });
          break;
        }


        console.warn('Unknown event:', event.name, 'Available events: send, receive, sendReview, sendConfirm, backToHome, refreshBalances, hideBalance, showBalance, viewAllTransactions, viewUTXOs, refreshUTXOs, goBack, copyAddress, settings');
        break;
    }
  }
};