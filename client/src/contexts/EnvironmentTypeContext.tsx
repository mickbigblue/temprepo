import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UrlProvider } from '../services/utils/UrlProvider';
import { useSnackbarContext } from './SnackbarContext';
import { useRestApi } from '../hooks/useRestApi';

const EnvironmentTypeContext = createContext<string>('Unknown');

export const useEnvironmentTypeContext = () =>
  useContext(EnvironmentTypeContext);

export const EnvironmentTypeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openSnackbar } = useSnackbarContext();
  const { get } = useRestApi();
  const [environmentType, setEnvironmentType] = useState('Unknown');

  useEffect(() => {
    const fetchEnvironmentType = async () => {
      try {
        const url = UrlProvider.getEnvironmentUrl();
        const response = await get(url);
        if (response.statusCode === 200) {
          setEnvironmentType(response.data.environmentType);
        } else {
          console.error('Error on fetching environment data:', response);
          openSnackbar('Error  on fetching environment data:', 'error');
        }
      } catch (error) {
        console.error('Network error on fetching environment data', error);
        openSnackbar('Network error on fetching environment data', 'error');
      }
    };

    fetchEnvironmentType();
  }, [openSnackbar, get]);

  return (
    <EnvironmentTypeContext.Provider value={environmentType}>
      {children}
    </EnvironmentTypeContext.Provider>
  );
};
