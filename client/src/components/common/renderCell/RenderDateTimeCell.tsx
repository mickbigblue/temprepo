import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const RenderDateTimeCell = (params: GridRenderCellParams) => {
  const { value } = params;
  const { i18n } = useTranslation();

  if (!value) {
    return null;
  }

  const locale = i18n.language.startsWith('de') ? de : enUS;
  const dateTimeFormat = i18n.language.startsWith('de')
    ? 'dd.MM.yyyy HH:mm'
    : 'MM-dd-yyyy hh:mm';

  const displayValue = format(new Date(value), dateTimeFormat, { locale });
  return <Typography>{displayValue}</Typography>;
};

export default RenderDateTimeCell;
