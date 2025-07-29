import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NameIdRecord } from '../../../interfaces/NameIdRecord';

const EditDropdownCell = (params: GridRenderEditCellParams) => {
  const { id, field, api, value, options, label, customHandleChange } = params;
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(value?.name || '');

  useEffect(() => {
    setSelectedValue(value?.name || '');
  }, [value]);

  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;

      setSelectedValue(newValue);
      api.setEditCellValue(
        {
          id,
          field,
          value: newValue,
          debounceMs: 200,
        },
        event
      );
    },
    [api, id, field]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth>
          <InputLabel>{t(label)}</InputLabel>
          <Select value={selectedValue} onChange={handleChange} displayEmpty>
            {options.map((item: NameIdRecord) => (
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

export default EditDropdownCell;
