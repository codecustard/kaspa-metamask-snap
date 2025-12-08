/* eslint-disable import-x/no-unassigned-import */

import 'styled-components';

/**
 * styled-component default theme extension
 */
declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/consistent-type-definitions */
  export interface DefaultTheme {
    fonts: Record<string, string>;
    fontSizes: Record<string, string>;
    fontWeights: Record<string, number>;
    lineHeights: Record<string, number>;
    spacing: Record<string, string>;
    breakpoints: string[];
    mediaQueries: Record<string, string>;
    radii: Record<string, string>;
    shadows: Record<string, string>;
    colors: Record<string, Record<string, string>>;
  }
}
