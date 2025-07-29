import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UrlProvider } from '../services/utils/UrlProvider';
import IVersionInfo from '../interfaces/IVersionInfo';
import { useSnackbarContext } from './SnackbarContext';
import { useRestApi } from '../hooks/useRestApi';

const defaultVersionInfo: IVersionInfo = {
  backendVersion: 'N/A',
  releaseVersion: 'N/A',
  databaseVersion: 'N/A',
  minimumPfmClientVersion: 'N/A',
  minimumAsfClientVersion: 'N/A',
};

const VersionContext = createContext<{ versionInfo: IVersionInfo }>({
  versionInfo: defaultVersionInfo,
});

export const useVersionContext = () => useContext(VersionContext);

export const VersionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openSnackbar } = useSnackbarContext();
  const { get } = useRestApi();
  const [versionInfo, setVersionInfo] =
    useState<IVersionInfo>(defaultVersionInfo);

  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        const url = UrlProvider.getVersionUrl();
        const response = await get(url);
        if (response.statusCode === 200) {
          const versionInfo: IVersionInfo = {
            backendVersion: response.data.version,
            releaseVersion: response.data.relatedMarketingVersion,
            databaseVersion: response.data.databaseVersion,
            minimumAsfClientVersion: response.data.minimumAsfClientVersion,
            minimumPfmClientVersion: response.data.minimumPfmClientVersion,
          };
          setVersionInfo(versionInfo);
        } else {
          console.error('Failed to fetch version information', response);
          openSnackbar('Failed to fetch version information', 'error');
        }
      } catch (error: any) {
        console.error('Network error on fetching version information', error);
        openSnackbar('Network error on fetching version information', 'error');
      }
    };

    fetchVersionInfo();
  }, [openSnackbar]);

  return (
    <VersionContext.Provider value={{ versionInfo }}>
      {children}
    </VersionContext.Provider>
  );
};
