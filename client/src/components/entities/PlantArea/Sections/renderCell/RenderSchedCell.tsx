import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useTranslation } from 'react-i18next';

const RenderSchedCell = (params: GridRenderCellParams) => {
  const { value } = params;
  const { t } = useTranslation();

  return <Typography>{value ? t('Yes') : t('No')}</Typography>;
};

export default RenderSchedCell;
