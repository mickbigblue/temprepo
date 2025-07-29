import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EditSchedCell: React.FC<GridRenderEditCellParams> = (params) => {
  const { value, id, label, field, api } = params;
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value === 'true';
    api.setEditCellValue({ id, field, value: newValue });
    api.updateRows([{ id, [field]: newValue }]); // Trigger re-render

    if (!newValue) {
      api.setEditCellValue({ id, field: 'line', value: null });
      api.updateRows([{ id, line: null }]);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{t(label)}</InputLabel>
      <Select value={value ? 'true' : 'false'} onChange={handleChange}>
        <MenuItem value="true">{t('Yes')}</MenuItem>
        <MenuItem value="false">{t('No')}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default EditSchedCell;
