import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { NameIdRecord } from '../../../../../interfaces/NameIdRecord';
import { useTranslation } from 'react-i18next';

const EditPccCell = (params: GridRenderEditCellParams) => {
  const { id, field, value, api, additionalData } = params;
  const { t } = useTranslation();

  if (!additionalData?.additionalData?.codes) {
    return <span style={{ color: 'red' }}>No PCC data available…</span>;
  }

  const handleChange = (event: SelectChangeEvent) => {
    const selectedPcc = additionalData.additionalData.codes.find(
      (pcc: string) => pcc === event.target.value
    );
    api.setEditCellValue({ id, field, value: selectedPcc });
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{t('PCC')}</InputLabel>
      <Select value={value || ''} onChange={handleChange}>
        {additionalData.additionalData.codes.map(
          (pcc: string, index: number) => (
            <MenuItem key={index} value={pcc}>
              {pcc}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default EditPccCell;
