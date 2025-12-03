
import {
  Box,
  Button,
  Text,
  Icon,
  SnapComponent,
  IconName,
} from '@metamask/snaps-sdk/jsx';

interface CTAProps {
  icon: `${IconName}`;
  label: string;
  name: string;
  [key: string]: any;
}

export const CTA: SnapComponent<CTAProps> = ({ name, icon, label }) => (
  <Box direction="vertical" alignment="center" center>
    <Button name={name} variant="primary">
      <Icon size="md" color="primary" name={icon} />
    </Button>
    <Text alignment="center">
      {label}
    </Text>
  </Box>
);