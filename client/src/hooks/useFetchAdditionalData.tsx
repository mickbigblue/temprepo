import { useState, useCallback } from 'react';
import { useRestApi } from './useRestApi';
import { useSnackbarContext } from '../contexts/SnackbarContext';

export function useFetchAdditionalData<T>(endpoint?: string) {
  const { get } = useRestApi();
  const { openSnackbar } = useSnackbarContext();
  const [additionalData, setAdditionalData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdditionalData = useCallback(async () => {
    if (!endpoint) return;

    setIsLoading(true);
    try {
      const response = await get(endpoint);

      if (response.statusCode === 200) {
        setAdditionalData(response.data);
      } else if (response.statusCode === 403) {
        const msg = 'UserNotFound';
        openSnackbar(msg, 'error');
      } else {
        const msg = response.data.messages.join(', ');
        openSnackbar(msg, 'error');
      }
    } catch (error) {
      console.error('Network error on fetching additional data', error);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, get, openSnackbar]);

  return {
    additionalData,
    isLoading,
    fetchAdditionalData,
  };
}
