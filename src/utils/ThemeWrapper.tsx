import React, { ReactNode } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import muiTheme from '../styles/theme/getMuiTheme';

export interface ThemeWrapperProps {
  children?: ReactNode;
}

const ThemeWrapper = ({ children }: ThemeWrapperProps) => (
  <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
);

export default ThemeWrapper;
