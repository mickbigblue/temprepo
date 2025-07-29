import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { NameIdRecord } from '../../../../../interfaces/NameIdRecord';
import { sortByName } from '../../../../../utils/nameIdSort';

const EditVirtualVehicleClassCell = (props: GridRenderEditCellParams) => {
  const { value, id, api, field, additionalData } = props;
  const [virtualVehicleClasses, setVirtualVehicleClasses] = useState(
    value || []
  );
  const [selectedVirtualVehicleClass, setSelectedVirtualVehicleClass] =
    useState('');

  const findIdByName = (name: string, options: NameIdRecord[]) =>
    options.find((option) => option.name === name)?.id;

  useEffect(() => {
    setVirtualVehicleClasses(value || []);
  }, [value]);

  const handleAdd = () => {
    if (selectedVirtualVehicleClass) {
      const newVirtualVehicleClass = {
        name: selectedVirtualVehicleClass,
        id: findIdByName(
          selectedVirtualVehicleClass,
          additionalData.fahrzeugklassen
        ),
      };
      const updatedVirtualVehicleClass = [
        ...virtualVehicleClasses,
        newVirtualVehicleClass,
      ];
      setVirtualVehicleClasses(updatedVirtualVehicleClass);
      api.setEditCellValue({ id, field, value: updatedVirtualVehicleClass });
      // Clear inputs after adding
      setSelectedVirtualVehicleClass('');
    }
  };

  const handleDelete = (index: number) => {
    const updatedVirtualVehicleClasses = virtualVehicleClasses.filter(
      (_: any, idx: number) => idx !== index
    );
    setVirtualVehicleClasses(updatedVirtualVehicleClasses);
    api.setEditCellValue({ id, field, value: updatedVirtualVehicleClasses });
  };

  const sortedVirtualVehicleClasses = sortByName(
    additionalData.fahrzeugklassen
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>vVehicleClass</InputLabel>
          <Select
            value={selectedVirtualVehicleClass}
            onChange={(e) => setSelectedVirtualVehicleClass(e.target.value)}
            displayEmpty
          >
            {sortedVirtualVehicleClasses.map((item: NameIdRecord) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={handleAdd} color="primary">
          <AddBoxIcon />
        </IconButton>
      </Box>
      <List dense>
        {value &&
          value.map((vVehicleClass: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${vVehicleClass.name}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
export default EditVirtualVehicleClassCell;
