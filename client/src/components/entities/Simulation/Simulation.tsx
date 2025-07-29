import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbarContext } from '../../../contexts/SnackbarContext';
import { useRestApi } from '../../../hooks/useRestApi';
import { useRouter } from '../../../hooks/useRouter';
import Status from '../../../interfaces/Status';
import { UrlProvider } from '../../../services/utils/UrlProvider';

const Simulation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { post } = useRestApi();
  const { openSnackbar } = useSnackbarContext();

  useEffect(() => {
    const sendSimulationRequest = async () => {
      const simURI = UrlProvider.getStartSimulationUrl();
      const msg = t('SimulationStart');
      openSnackbar(msg, 'success');

      const response = await post(simURI, {}, false);

      if (response.statusCode !== 200) {
        const msg = t('SimulationError');
        openSnackbar(msg, 'error');
      } else {
        const statusBody: Status = {
          correlationId: response.data.correlationID,
          status: response.data.status,
          messages: response.data.messages,
        };
        if (statusBody.status === 2) {
          router.navigate('/filedownload', { replace: true });
          const msg = t('SimulationSuccess');
          openSnackbar(msg, 'success');
          // If status in body is 1, we have a timeout from backend and no message is provided
        } else if (statusBody.status === 1) {
          openSnackbar('Timeout!', 'error');
        } else {
          const msg = response.data.messages
            .map((msg: any) => msg.message)
            .join(' ');
          openSnackbar(msg, 'error');
        }
      }
    };
    sendSimulationRequest();
  }, [openSnackbar, post, router, t]);

  return <></>;
};

export default Simulation;
