import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { ReactNode } from 'react';
import './App.css';
import { ConfigProvider } from './contexts/ConfigContext';
import {
  EnvironmentTypeProvider,
  useEnvironmentTypeContext,
} from './contexts/EnvironmentTypeContext';
import { FlexEnabledProvider } from './contexts/FlexEnabledContext';
import { PlantProvider } from './contexts/PlantContext';
import { SeparatorProvider } from './contexts/SeparatorContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { UserProvider } from './contexts/UserContext';
import { VersionProvider } from './contexts/VersionContext';
import Router from './router/Router';
import { PrivilegesProvider } from './contexts/PrivilegesContext';
import { PaginationProvider } from './contexts/PaginationContext';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const ThemeWithEnvironment: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const environmentType = useEnvironmentTypeContext();

  let primaryMainColor = '';
  switch (environmentType) {
    case 'production':
      primaryMainColor = '#003366'; /* Gruenblau */
      break;
    case 'test':
      primaryMainColor = '#993366'; /* Aubergine */
      break;
    default:
      primaryMainColor = '#222222'; /* Aubergine */
      break;
  }
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            light: '#676767',
            main: primaryMainColor,
          },
          secondary: {
            light: '#5097AB',
            main: '#00677F',
            dark: '#003340',
            contrastText: '#FFFFFF',
          },
        },
      }),
    [primaryMainColor]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const PfmApp = (): JSX.Element => {
  return (
    <React.StrictMode>
      <SnackbarProvider>
        <EnvironmentTypeProvider>
          <VersionProvider>
            <FlexEnabledProvider>
              <SeparatorProvider>
                <ThemeWithEnvironment>
                  <UserProvider>
                    <PlantProvider>
                      <ConfigProvider>
                        <PrivilegesProvider>
                          <PaginationProvider>
                            <Router />
                          </PaginationProvider>
                        </PrivilegesProvider>
                      </ConfigProvider>
                    </PlantProvider>
                  </UserProvider>
                </ThemeWithEnvironment>
              </SeparatorProvider>
            </FlexEnabledProvider>
          </VersionProvider>
        </EnvironmentTypeProvider>
      </SnackbarProvider>
    </React.StrictMode>
  );
};

export default PfmApp;
