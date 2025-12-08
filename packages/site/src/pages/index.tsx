// Remove unused React import
import styled from 'styled-components';

import { defaultSnapOrigin } from '../config';
import {
  useMetaMask,
  useInvokeSnap,
  useMetaMaskContext,
  useRequestSnap,
} from '../hooks';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';

// Styled Components
const PageContainer = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background?.default};
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl}
    ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  min-height: 90vh;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: ${({ theme }) => theme.spacing.xl}
      ${({ theme }) => theme.spacing.sm};
    min-height: 80vh;
  }
`;

const HeroTitle = styled.h1`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary?.default} 0%,
    ${({ theme }) => theme.colors.accent?.default} 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-width: 800px;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text?.muted};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${({ theme }) => theme.mediaQueries.small} {
    flex-direction: column;
    width: 100%;
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl}
    ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: ${({ theme }) => theme.spacing.xl}
      ${({ theme }) => theme.spacing.sm};
  }
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text?.default};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.card?.default};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary?.default};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) =>
    `${theme.colors.primary?.muted ?? theme.colors.primary?.default}20`};
  border-radius: ${({ theme }) => theme.radii.default};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text?.default};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text?.muted};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const getStatusBackground = (theme: any, status: string) => {
  switch (status) {
    case 'success':
      return theme.colors.success?.muted;
    case 'warning':
      return theme.colors.warning?.muted;
    case 'error':
      return theme.colors.error?.muted;
    default:
      return theme.colors.background?.alternative;
  }
};

const getStatusBorder = (theme: any, status: string) => {
  switch (status) {
    case 'success':
      return theme.colors.success?.default;
    case 'warning':
      return theme.colors.warning?.default;
    case 'error':
      return theme.colors.error?.default;
    default:
      return theme.colors.border?.default;
  }
};

const StatusCard = styled.div<{
  status: 'success' | 'warning' | 'error' | 'info';
}>`
  background: ${({ theme, status }) => getStatusBackground(theme, status)};
  border: 1px solid ${({ theme, status }) => getStatusBorder(theme, status)};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.md} 0;
  text-align: center;
`;

// We'll use the global button classes from GlobalStyle instead

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.md} 0;
  text-align: center;
`;

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const invokeSnap = useInvokeSnap();

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const handleInstallSnap = async () => {
    await requestSnap();
  };

  const handleOpenWallet = async () => {
    await invokeSnap({ method: 'showWallet' });
  };

  const getConnectionStatus = () => {
    if (!isMetaMaskReady) {
      return {
        status: 'error' as const,
        message: 'MetaMask Flask not detected',
        action: 'Install MetaMask Flask',
      };
    }
    if (!installedSnap) {
      return {
        status: 'warning' as const,
        message: 'Hoosat Snap not installed',
        action: 'Install Hoosat Snap',
      };
    }
    if (shouldDisplayReconnectButton(installedSnap)) {
      return {
        status: 'info' as const,
        message: 'Development mode - Snap may need updating',
        action: 'Update Snap',
      };
    }
    return {
      status: 'success' as const,
      message: 'Hoosat Snap connected successfully',
      action: 'Open Wallet',
    };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>Hoosat Network Wallet for MetaMask</HeroTitle>
        <HeroSubtitle>
          Experience fast transactions on the Hoosat Network directly in
          MetaMask. Send, receive, and manage HTN tokens with secure,
          non-custodial wallet functionality.
        </HeroSubtitle>

        {error && (
          <ErrorMessage>
            <strong>Connection Error:</strong> {error.message}
          </ErrorMessage>
        )}

        <StatusCard status={connectionStatus.status}>
          <strong>{connectionStatus.message}</strong>
        </StatusCard>

        <ButtonGroup>
          {!isMetaMaskReady && (
            <button
              className="button-primary"
              onClick={() =>
                window.open('https://metamask.io/flask/', '_blank')
              }
            >
              🦊 Install MetaMask Flask
            </button>
          )}

          {isMetaMaskReady && !installedSnap && (
            <button
              className="button-primary"
              onClick={() => {
                handleInstallSnap().catch(console.error);
              }}
            >
              🚀 Install Hoosat Snap
            </button>
          )}

          {shouldDisplayReconnectButton(installedSnap) && (
            <button
              className="button-primary"
              onClick={() => {
                requestSnap().catch(console.error);
              }}
            >
              🔄 Update Snap
            </button>
          )}

          {installedSnap && !shouldDisplayReconnectButton(installedSnap) && (
            <button
              className="button-primary"
              onClick={() => {
                handleOpenWallet().catch(console.error);
              }}
            >
              💼 Open Wallet
            </button>
          )}

          <button
            className="button-secondary"
            onClick={() => window.open('https://explorer.hoosat.fi/', '_blank')}
          >
            🔍 Explore Network
          </button>
        </ButtonGroup>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesTitle>Why Choose Hoosnap?</FeaturesTitle>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Lightning Fast</FeatureTitle>
            <FeatureDescription>
              Experience near-instant transactions with Hoosat's cutting-edge
              blockDAG technology. No more waiting for confirmations.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure & Non-Custodial</FeatureTitle>
            <FeatureDescription>
              Your private keys never leave MetaMask. Enjoy full custody of your
              HTN tokens with enterprise-grade security.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <FeatureTitle>Seamless Integration</FeatureTitle>
            <FeatureDescription>
              Built natively for MetaMask using the latest Snaps technology. No
              additional apps or browser extensions needed.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Real-Time Insights</FeatureTitle>
            <FeatureDescription>
              Track your transaction history, monitor UTXO health, and optimize
              performance with built-in analytics.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔧</FeatureIcon>
            <FeatureTitle>Advanced Features</FeatureTitle>
            <FeatureDescription>
              UTXO compounding, custom fee control, and batch transactions.
              Perfect for both beginners and power users.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🌍</FeatureIcon>
            <FeatureTitle>Open Source</FeatureTitle>
            <FeatureDescription>
              Fully open source and community-driven. Contribute to the future
              of decentralized finance on Hoosat Network.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </PageContainer>
  );
};

export default Index;
