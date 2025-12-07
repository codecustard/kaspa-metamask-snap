import type { OnInstallHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Text } from '@metamask/snaps-sdk/jsx';

export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: (
        <Box>
          <Heading>Welcome to Hoosat Wallet!</Heading>
          <Text>
            Your wallet has been successfully installed. You can now interact
            with the Hoosat network directly from MetaMask.
          </Text>
        </Box>
      ),
    },
  });
};
