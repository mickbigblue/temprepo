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
import { useTranslation } from 'react-i18next';
import { NameIdRecord } from '../../../../../interfaces/NameIdRecord';

const EditWorkingHoursCell = (props: GridRenderEditCellParams) => {
  const { value, id, api, field, additionalData } = props;
  const [workingHours, setWorkingHours] = useState(value || []);
  const [selectedWorkingHours, setSelectedWorkingHours] = useState('');
  const { t } = useTranslation();

  const findIdByName = (name: string, options: NameIdRecord[]) =>
    options.find((option) => option.name === name)?.id;

  useEffect(() => {
    setWorkingHours(value || []);
  }, [value]);

  const handleAdd = () => {
    if (selectedWorkingHours) {
      const newWorkingHour = {
        name: selectedWorkingHours,
        id: findIdByName(selectedWorkingHours, additionalData.azintervalle),
      };
      const updatedWorkingHours = [...workingHours, newWorkingHour];
      setWorkingHours(updatedWorkingHours);
      api.setEditCellValue({ id, field, value: updatedWorkingHours });
      // Clear inputs after adding
      setSelectedWorkingHours('');
    }
  };

  const handleDelete = (index: number) => {
    const updatedWorkingHours = workingHours.filter(
      (_: any, idx: number) => idx !== index
    );
    setWorkingHours(updatedWorkingHours);
    api.setEditCellValue({ id, field, value: updatedWorkingHours });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>{t('WorkingHours')}</InputLabel>
          <Select
            value={selectedWorkingHours}
            onChange={(e) => setSelectedWorkingHours(e.target.value)}
            displayEmpty
          >
            {additionalData.azintervalle.map((item: NameIdRecord) => (
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
          value.map((workingHour: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${workingHour.name}`} />
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
export default EditWorkingHoursCell;
