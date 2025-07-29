import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { SectionType } from '../../../../../interfaces/Sections';
import { useTranslation } from 'react-i18next';

const EditTypeCell = (params: GridRenderEditCellParams) => {
  const { value, id, field, api } = params;
  const { t } = useTranslation();

  type EnumObject = { [key: string]: string | number };

  const enumToArray = (enumObject: EnumObject) => {
    return Object.keys(enumObject).map((key) => ({
      key,
      value: enumObject[key],
    }));
  };

  const sectionTypes = enumToArray(SectionType);

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    api.setEditCellValue({ id, field, value: newValue });
    api.updateRows([{ id, [field]: newValue }]); // Trigger re-render

    if (newValue === 'VT') {
      api.setEditCellValue({ id, field: 'density', value: null });
      api.updateRows([{ id, density: null }]);
    }
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{t('Type')}</InputLabel>
      <Select value={value || ''} onChange={handleChange}>
        {sectionTypes.map((type) => (
          <MenuItem key={type.key} value={type.value}>
            {type.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EditTypeCell;
