import type { OnUpdateHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Text } from '@metamask/snaps-sdk/jsx';

export const onUpdate: OnUpdateHandler = async () => {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: (
        <Box>
          <Heading>Hoosat Wallet Updated!</Heading>
          <Text>
            Your Hoosat Wallet snap has been updated to the latest version. New
            features and improvements are now available.
          </Text>
        </Box>
      ),
    },
  });
};
