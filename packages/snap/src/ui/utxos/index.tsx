
import {
  Box,
  Container,
  Heading,
  Button,
  Icon,
} from '@metamask/snaps-sdk/jsx';

import { UTXOList } from '../components/UTXOList';

interface UTXOsPageProps {
  utxos: any[];
  address: string;
  [key: string]: any;
}

export function utxosPage(props: UTXOsPageProps) {
  const { utxos, address } = props;

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
          <Button name="refreshUTXOs" variant="primary">
            <Icon color="primary" name="refresh" />
          </Button>
        </Box>

        <UTXOList utxos={utxos} />
      </Box>
    </Container>
  );
}