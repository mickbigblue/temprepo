import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NameIdRecord } from '../../../../../interfaces/NameIdRecord';

const EditLineCell = (params: GridRenderEditCellParams) => {
  const { id, field, api, value, additionalData } = params;
  const { t } = useTranslation();
  const [line, setLine] = useState(value ? value.name : '');

  const findIdByName = (name: string, options: NameIdRecord[]) =>
    options.find((option) => option.name === name)?.id;

  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;

      const updatedValue = {
        id: findIdByName(newValue, additionalData.baender),
        name: newValue,
      };

      setLine(newValue);
      api.setEditCellValue(
        {
          id,
          field,
          value: updatedValue,
          debounceMs: 200,
        },
        event
      );
    },
    [api, id, additionalData.baender, field]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth>
          <InputLabel>{t('Line')}</InputLabel>
          <Select value={line} onChange={handleChange} displayEmpty>
            {additionalData.baender.map((item: NameIdRecord) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
export default EditLineCell;
