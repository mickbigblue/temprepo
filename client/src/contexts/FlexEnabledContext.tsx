import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UrlProvider } from '../services/utils/UrlProvider';
import { useRestApi } from '../hooks/useRestApi';
import { useSnackbarContext } from './SnackbarContext';

const FlexEnabledContext = createContext<boolean>(false);

export const useFlexEnabledContext = () => useContext(FlexEnabledContext);

export const FlexEnabledProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openSnackbar } = useSnackbarContext();
  const { get } = useRestApi();
  const [flexEnabled, setFlexEnabled] = useState(false);

  useEffect(() => {
    const fetchFlexEnabled = async () => {
      try {
        const url = UrlProvider.getPlantUrl();
        const response = await get(url);
        if (response.statusCode === 200) {
          setFlexEnabled(response.data.flexEnabled);
        } else {
          console.error('Failed to fetch flexEnabled data', response);
          openSnackbar('Failed to fetch flexEnabled data', 'error');
        }
      } catch (error) {
        console.error('Network error on fetching flexEnabled data', error);
        openSnackbar('Network error on fetching flexEnabled data', 'error');
      }
    };

    fetchFlexEnabled();
  }, [openSnackbar]);

  return (
    <FlexEnabledContext.Provider value={flexEnabled}>
      {children}
    </FlexEnabledContext.Provider>
  );
};
