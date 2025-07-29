import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { format, isValid } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const RenderDateCell = (params: GridRenderCellParams) => {
  const { value } = params;
  const { i18n } = useTranslation();

  if (!value) {
    return null;
  }

  const locale = i18n.language.startsWith('de') ? de : enUS;
  const dateFormat = i18n.language.startsWith('de')
    ? 'dd.MM.yyyy'
    : 'MM-dd-yyyy';

  const displayValue = format(new Date(value), dateFormat, { locale });
  return <Typography>{displayValue}</Typography>;
};

export default RenderDateCell;
