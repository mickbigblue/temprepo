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

const EditVehicleRuleCell = (params: GridRenderEditCellParams) => {
  const { id, field, value, api, additionalData } = params;
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    const selectedVehicleRule = additionalData.fahrzeugRegeln.find(
      (vehicleRule: NameIdRecord) => vehicleRule.name === event.target.value
    );
    api.setEditCellValue({ id, field, value: selectedVehicleRule });
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{t('VehicleRule')}</InputLabel>
      <Select value={value ? value.name : ''} onChange={handleChange}>
        {additionalData.fahrzeugRegeln.map((vehicleRule: NameIdRecord) => (
          <MenuItem key={vehicleRule.id} value={vehicleRule.name}>
            {vehicleRule.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EditVehicleRuleCell;
