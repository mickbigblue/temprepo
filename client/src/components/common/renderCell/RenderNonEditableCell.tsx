import { TextField } from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { useTranslation } from 'react-i18next';

const RenderNonEditableCell = (props: GridRenderEditCellParams) => {
  const { value, label, field } = props;
  const { t } = useTranslation();

  const getDisplayValue = (val: any) => {
    if (field === 'sched') {
      return val ? t('Yes') : t('No');
    }
    if (typeof val === 'object' && val !== null) {
      return val.name;
    }
    return val;
  };

  return (
    <TextField
      label={t(label)}
      value={getDisplayValue(value) || ''}
      InputProps={{
        readOnly: true,
        style: { backgroundColor: '#f0f0f0', color: '#a0a0a0' },
      }}
      variant="outlined"
      fullWidth
    />
  );
};

export default RenderNonEditableCell;
