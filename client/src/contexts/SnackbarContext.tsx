import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { AlertType } from '../interfaces/Alerts';

type SeverityType = 'error' | 'warning' | 'info' | 'success';

interface AlertComponentProps extends AlertProps {
  onClose: () => void;
}

const Alert: FC<AlertComponentProps> = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

interface SnackbarContextType {
  openSnackbar: (
    message: string,
    severity: SeverityType,
    warningMessages?: string[],
    onCloseCallback?: () => void
  ) => void;
  closeSnackbar: () => void;
}
const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbarContext = () =>
  useContext(SnackbarContext) as SnackbarContextType;

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [onCloseCallback, setOnCloseCallback] = useState<() => void>(() => {});

  const openSnackbar = useCallback(
    (
      message: string,
      severity: SeverityType,
      additionalMessages: string[] = [],
      onCloseCallback?: () => void
    ) => {
      const alerts = [
        { message, severity },
        ...additionalMessages.map((msg) => ({
          message: msg,
          severity: 'warning' as SeverityType,
        })),
      ];
      setAlerts(alerts);
      setSnackbarOpen(true);
      if (onCloseCallback) {
        setOnCloseCallback(() => onCloseCallback);
      }
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    setSnackbarOpen(false);
    setAlerts([]);
    if (onCloseCallback) {
      onCloseCallback();
      setOnCloseCallback(() => {});
    }
  }, [onCloseCallback]);

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        onClose={closeSnackbar}
        autoHideDuration={null}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              onClose={closeSnackbar}
              severity={alert.severity}
            >
              {typeof alert.message === 'string'
                ? alert.message
                : alert.message.message}
            </Alert>
          ))}
        </div>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
