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

const PlantContext = createContext<string>('NoPlant');

export const usePlantContext = () => useContext(PlantContext);

export const PlantProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openSnackbar } = useSnackbarContext();
  const { get } = useRestApi();
  const { t } = useTranslation();

  const [plant, setPlant] = useState('NoPlant');

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const url = UrlProvider.getPlantUrl();
        const response = await get(url);
        if (response.statusCode === 200) {
          setPlant(response.data.name);
          document.title = 'PFM Client ' + response.data.name;
        } else {
          console.error('Error on fetching plant data:', response);
          openSnackbar(t('PlantNotFound'), 'error');
        }
      } catch (error) {
        console.error('Network error on fetching plant data', error);
        openSnackbar(t('PlantNotFound'), 'error');
      }
    };

    fetchPlant();
  }, [openSnackbar, t, get]);

  return (
    <PlantContext.Provider value={plant}>{children}</PlantContext.Provider>
  );
};
