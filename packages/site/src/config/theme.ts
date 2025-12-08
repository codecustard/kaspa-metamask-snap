import type { DefaultTheme } from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const breakpoints = ['600px', '768px', '992px'];

/**
 * Common theme properties.
 */
const theme = {
  fonts: {
    default:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  fontSizes: {
    heading: '4.8rem',
    mobileHeading: '3.2rem',
    title: '3.6rem',
    subtitle: '2.4rem',
    large: '2rem',
    text: '1.6rem',
    small: '1.4rem',
    xs: '1.2rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  spacing: {
    xs: '0.8rem',
    sm: '1.6rem',
    md: '2.4rem',
    lg: '3.2rem',
    xl: '4.8rem',
    xxl: '6.4rem',
  },
  radii: {
    sm: '6px',
    default: '12px',
    lg: '16px',
    xl: '24px',
    button: '8px',
  },
  breakpoints,
  mediaQueries: {
    small: `@media screen and (max-width: ${breakpoints[0] as string})`,
    medium: `@media screen and (min-width: ${breakpoints[1] as string})`,
    large: `@media screen and (min-width: ${breakpoints[2] as string})`,
  },
  shadows: {
    default: '0px 7px 42px rgba(0, 0, 0, 0.1)',
    button: '0px 0px 16.1786px rgba(0, 0, 0, 0.15);',
  },
};

/**
 * Light theme color properties - Hoosat inspired.
 */
export const light: DefaultTheme = {
  colors: {
    background: {
      default: '#FAFAFA',
      alternative: '#F4F4F5',
      inverse: '#09090B',
    },
    icon: {
      default: '#18181B',
      alternative: '#71717A',
    },
    text: {
      default: '#09090B',
      muted: '#71717A',
      alternative: '#3F3F46',
      inverse: '#FAFAFA',
    },
    border: {
      default: '#E4E4E7',
    },
    primary: {
      default: '#3B82F6',
      inverse: '#FFFFFF',
    },
    card: {
      default: '#FFFFFF',
    },
    error: {
      default: '#EF4444',
      alternative: '#DC2626',
      muted: '#FEF2F2',
    },
    success: {
      default: '#10B981',
      alternative: '#059669',
      muted: '#ECFDF5',
    },
    warning: {
      default: '#F59E0B',
      alternative: '#D97706',
      muted: '#FFFBEB',
    },
    accent: {
      default: '#8B5CF6',
      alternative: '#7C3AED',
      muted: '#F3E8FF',
    },
  },
  ...theme,
};

/**
 * Dark theme color properties - Hoosat inspired dark mode
 */
export const dark: DefaultTheme = {
  colors: {
    background: {
      default: '#09090B',
      alternative: '#18181B',
      inverse: '#FAFAFA',
    },
    icon: {
      default: '#FAFAFA',
      alternative: '#A1A1AA',
    },
    text: {
      default: '#FAFAFA',
      muted: '#A1A1AA',
      alternative: '#D4D4D8',
      inverse: '#09090B',
    },
    border: {
      default: '#27272A',
    },
    primary: {
      default: '#3B82F6',
      inverse: '#FFFFFF',
    },
    card: {
      default: '#18181B',
    },
    error: {
      default: '#EF4444',
      alternative: '#DC2626',
      muted: '#450A0A',
    },
    success: {
      default: '#10B981',
      alternative: '#059669',
      muted: '#064E3B',
    },
    warning: {
      default: '#F59E0B',
      alternative: '#D97706',
      muted: '#451A03',
    },
    accent: {
      default: '#8B5CF6',
      alternative: '#7C3AED',
      muted: '#3730A3',
    },
  },
  ...theme,
};

/**
 * Default style applied to the app.
 *
 * @param props - Styled Components props.
 * @returns Global style React component.
 */
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    background-color: ${(props) => props.theme.colors.background?.default};
    color: ${(props) => props.theme.colors.text?.default};
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes.text};
    line-height: ${(props) => props.theme.lineHeights.normal};
    margin: 0;
    padding: 0;
    antialiased: true;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    transition: all 0.2s ease-in-out;
  }

  h1 {
    font-family: ${(props) => props.theme.fonts.heading};
    font-size: ${(props) => props.theme.fontSizes.heading};
    font-weight: ${(props) => props.theme.fontWeights.bold};
    line-height: ${(props) => props.theme.lineHeights.tight};
    margin: 0;

    ${(props) => props.theme.mediaQueries.small} {
      font-size: ${(props) => props.theme.fontSizes.mobileHeading};
    }
  }

  h2 {
    font-family: ${(props) => props.theme.fonts.heading};
    font-size: ${(props) => props.theme.fontSizes.title};
    font-weight: ${(props) => props.theme.fontWeights.semibold};
    line-height: ${(props) => props.theme.lineHeights.tight};
    margin: 0;
  }

  h3 {
    font-family: ${(props) => props.theme.fonts.heading};
    font-size: ${(props) => props.theme.fontSizes.subtitle};
    font-weight: ${(props) => props.theme.fontWeights.semibold};
    line-height: ${(props) => props.theme.lineHeights.normal};
    margin: 0;
  }

  p {
    font-size: ${(props) => props.theme.fontSizes.text};
    line-height: ${(props) => props.theme.lineHeights.relaxed};
    margin: 0;
  }

  code {
    background-color: ${(props) => props.theme.colors.background?.alternative};
    font-family: ${(props) => props.theme.fonts.code};
    padding: 0.4rem 0.8rem;
    border-radius: ${(props) => props.theme.radii.sm};
    font-size: ${(props) => props.theme.fontSizes.small};
    border: 1px solid ${(props) => props.theme.colors.border?.default};
  }

  .button-primary {
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes.small};
    font-weight: ${(props) => props.theme.fontWeights.medium};
    border-radius: ${(props) => props.theme.radii.button};
    background-color: ${(props) => props.theme.colors.primary?.default};
    color: ${(props) => props.theme.colors.primary?.inverse};
    border: 1px solid ${(props) => props.theme.colors.primary?.default};
    padding: 1.2rem 2.4rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    text-decoration: none;

    &:hover {
      background-color: ${(props) => props.theme.colors.primary?.alternative ?? props.theme.colors.primary?.default};
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  .button-secondary {
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes.small};
    font-weight: ${(props) => props.theme.fontWeights.medium};
    border-radius: ${(props) => props.theme.radii.button};
    background-color: transparent;
    color: ${(props) => props.theme.colors.text?.default};
    border: 1px solid ${(props) => props.theme.colors.border?.default};
    padding: 1.2rem 2.4rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    text-decoration: none;

    &:hover {
      background-color: ${(props) => props.theme.colors.background?.alternative};
      border-color: ${(props) => props.theme.colors.primary?.default};
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
`;
