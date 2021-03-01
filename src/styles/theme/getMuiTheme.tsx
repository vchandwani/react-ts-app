import { createMuiTheme } from '@material-ui/core/styles';
import { Overrides as CoreOverrides } from '@material-ui/core/styles/overrides';
import { AlertClassKey, AutocompleteClassKey } from '@material-ui/lab';
import { CSSProperties } from '@material-ui/styles';

interface Overrides extends CoreOverrides {
  MuiAlert?:
    | Partial<Record<AlertClassKey, CSSProperties | (() => CSSProperties)>>
    | undefined;
  MuiAutoComplete?:
    | Partial<
        Record<AutocompleteClassKey, CSSProperties | (() => CSSProperties)>
      >
    | undefined;
}

// default font
export const fonts = {
  main: 'Open Sans',
  fixedWidth: 'Roboto Mono',
};

const customColors = {
  primary: {
    hover: '#4d004d',
  },
  secondary: {
    hover: '#11008f',
  },
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7a1c5b',
    },
    secondary: {
      main: '#0b0157',
    },
  },
});

const { palette } = theme;
const overridesOptions: { overrides: Overrides } = {
  overrides: {
    MuiInput: {
      root: {
        '& > .MuiInput Adornment-positionEnd': {
          marginTop: '0.5rem',
        },
      },
      underline: {
        '&:before': {
          borderBottom: `2px ${customColors.primary.hover} ${palette.divider}`,
        },
        '&:after': {
          borderBottom: `2px ${customColors.secondary.hover} ${palette.primary.dark}`,
        },
      },
    },
  },
};
theme.overrides = overridesOptions.overrides;
export default theme;
