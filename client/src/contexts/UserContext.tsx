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
import { useTranslation } from 'react-i18next';

const UserContext = createContext<string>('NoUser');

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openSnackbar } = useSnackbarContext();
  const { get } = useRestApi();
  const { t } = useTranslation();
  const [user, setUser] = useState('NoUser');

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.REACT_APP_USER_INFO
    ) {
      setUser(process.env.REACT_APP_USER_INFO);
      return;
    }

    const fetchUser = async () => {
      try {
        const url = UrlProvider.getUserNameUrl();
        const response = await get(url);
        if (response.statusCode === 200) {
          setUser(response.data.username);
        } else {
          console.error('Error on fetching user data:', response);
          openSnackbar(t('UserNotFound'), 'error');
        }
      } catch (error) {
        console.error('Network error on fetching user data', error);
        openSnackbar(t('UserNotFound'), 'error');
      }
    };

    fetchUser();
  }, [openSnackbar, t, get]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
