interface SystemColor {
  light: string;
  dark: string;
}

interface ColorPalette {
  systemBackground: SystemColor;
  secondarySystemBackground: SystemColor;
  tertiarySystemBackground: SystemColor;
  label: SystemColor;
  secondaryLabel: SystemColor;
  tertiaryLabel: SystemColor;
  quaternaryLabel: SystemColor;
  placeholderText: SystemColor;
  separator: SystemColor;
  opaqueSeparator: SystemColor;
  link: SystemColor;
  red: SystemColor;
  orange: SystemColor;
  yellow: SystemColor;
  green: SystemColor;
  mint: SystemColor;
  teal: SystemColor;
  cyan: SystemColor;
  blue: SystemColor;
  indigo: SystemColor;
  purple: SystemColor;
  pink: SystemColor;
  brown: SystemColor;
  systemGrey: SystemColor;
  systemGrey2: SystemColor;
  systemGrey3: SystemColor;
  systemGrey4: SystemColor;
  systemGrey5: SystemColor;
  systemGrey6: SystemColor;
}

const systemColors: ColorPalette = {
  systemBackground: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  secondarySystemBackground: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  tertiarySystemBackground: {
    light: '#FFFFFF',
    dark: '#2C2C2E',
  },
  label: {
    light: '#000000',
    dark: '#FFFFFF',
  },
  secondaryLabel: {
    light: '#3C3C43',
    dark: '#E5E5EA',
  },
  tertiaryLabel: {
    light: '#3C3C434D',
    dark: '#E5E5EA99',
  },
  quaternaryLabel: {
    light: '#3C3C432E',
    dark: '#E5E5EA66',
  },
  placeholderText: {
    light: '#3C3C434D',
    dark: '#E5E5EA99',
  },
  separator: {
    light: '#C6C6C8',
    dark: '#38383A',
  },
  opaqueSeparator: {
    light: '#C6C6C8',
    dark: '#38383A',
  },
  link: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  red: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  orange: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
  yellow: {
    light: '#FFCC00',
    dark: '#FFD60A',
  },
  green: {
    light: '#34C759',
    dark: '#30D158',
  },
  mint: {
    light: '#00C7BE',
    dark: '#32D74B',
  },
  teal: {
    light: '#5AC8FA',
    dark: '#64D2FF',
  },
  cyan: {
    light: '#32ADE6',
    dark: '#64D2FF',
  },
  blue: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  indigo: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  purple: {
    light: '#AF52DE',
    dark: '#BF5AF2',
  },
  pink: {
    light: '#FF2D55',
    dark: '#FF375F',
  },
  brown: {
    light: '#A2845E',
    dark: '#AC8E68',
  },
  systemGrey: {
    light: '#8E8E93',
    dark: '#8E8E93',
  },
  systemGrey2: {
    light: '#AEAEB2',
    dark: '#636366',
  },
  systemGrey3: {
    light: '#C7C7CC',
    dark: '#48484A',
  },
  systemGrey4: {
    light: '#D1D1D6',
    dark: '#3A3A3C',
  },
  systemGrey5: {
    light: '#E5E5EA',
    dark: '#2C2C2E',
  },
  systemGrey6: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
};


export default systemColors;
