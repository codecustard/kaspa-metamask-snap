import { Box, Container, Heading, Button, Icon } from '@metamask/snaps-sdk/jsx';

import { utxoList } from '../components/UTXOList';

type UTXOsPageProps = {
  utxos: any[];
  address: string;
  [key: string]: any;
};

/**
 * Display UTXOs page interface
 *
 * @param props - UTXO page component properties
 * @returns JSX element for UTXOs page
 */
export function utxosPage(props: UTXOsPageProps) {
  const { utxos } = props;

  const shouldShowCompound = utxos && utxos.length > 1;

  return (
    <Container>
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Heading size="lg">UTXOs</Heading>
          <Button name="goBack" variant="primary">
            <Icon name="arrow-left" />
          </Button>
        </Box>

        <Box direction="horizontal" alignment="space-between">
          <Heading size="md">Address</Heading>
          <Box direction="horizontal">
            {shouldShowCompound && (
              <Button name="compoundUTXOs" variant="primary">
                <Icon color="primary" name="coin" />
              </Button>
            )}
            <Button name="refreshUTXOs" variant="primary">
              <Icon color="primary" name="refresh" />
            </Button>
          </Box>
        </Box>

        {utxoList({ utxos })}
      </Box>
    </Container>
  );
}
