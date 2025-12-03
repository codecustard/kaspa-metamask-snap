
import {
  Box,
  Text,
  Heading,
  Button,
} from '@metamask/snaps-sdk/jsx';

interface UTXO {
  outpoint: {
    transactionId: string;
    index: number;
  };
  amount: string;
  scriptPublicKeyAddress: string;
  blockDaaScore?: number;
  isCoinbase?: boolean;
  [key: string]: any;
}

interface UTXOListProps {
  utxos: UTXO[];
  [key: string]: any;
}

export function UTXOList(props: UTXOListProps) {
  const { utxos } = props;

  if (!utxos || utxos.length === 0) {
    return (
      <Box>
        <Text color="alternative">No UTXOs available</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="sm">Available UTXOs ({utxos.length.toString()})</Heading>

      {utxos.slice(0, 5).map((utxo, index) => {
        const amount = parseFloat(utxo.amount || '0');
        const formattedAmount = amount === 0 ? '0.00000000' : amount.toFixed(8);

        return (
        <Box key={`utxo-${index}`} direction="vertical">
          <Button name={`viewUTXO:${utxo.outpoint.transactionId}:${utxo.outpoint.index}:${utxo.scriptPublicKeyAddress}`} variant="primary">
            {formattedAmount} HTN - {utxo.scriptPublicKeyAddress.substring(0, 30)}...
          </Button>
        </Box>
        );
      })}

      {utxos.length > 5 ? (
        <Text color="alternative" size="sm">
          ... and {(utxos.length - 5).toString()} more UTXOs
        </Text>
      ) : null}
    </Box>
  );
}