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

const EditRolesCell = (props: GridRenderEditCellParams) => {
  const { value, id, api, field, additionalData } = props;
  const [roles, setRoles] = useState(value || []);
  const [selectedRole, setSelectedRole] = useState('');

  const findIdByName = (name: string, options: NameIdRecord[]) =>
    options.find((option) => option.name === name)?.id;

  useEffect(() => {
    setRoles(value || []);
  }, [value]);

  const handleAdd = () => {
    if (selectedRole) {
      const newRole = {
        name: selectedRole,
        id: findIdByName(selectedRole, additionalData.roles),
      };
      const updatedRole = [...roles, newRole];
      setRoles(updatedRole);
      api.setEditCellValue({ id, field, value: updatedRole });
      // Clear inputs after adding
      setSelectedRole('');
    }
  };

  const handleDelete = (index: number) => {
    const updatedRoles = roles.filter((_: any, idx: number) => idx !== index);
    setRoles(updatedRoles);
    api.setEditCellValue({ id, field, value: updatedRoles });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            displayEmpty
          >
            {additionalData.roles.map((item: NameIdRecord) => (
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
          value.map((role: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${role.name}`} />
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
export default EditRolesCell;
