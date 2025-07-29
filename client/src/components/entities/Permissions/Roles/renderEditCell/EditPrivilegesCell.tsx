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
import { useTranslation } from 'react-i18next';

const EditPrivilegesCell = (props: GridRenderEditCellParams) => {
  const { value, id, api, field, additionalData } = props;
  const [privileges, setPrivileges] = useState(value || []);
  const [selectedPrivilege, setSelectedPrivilege] = useState('');
  const { t } = useTranslation();

  const findIdByName = (name: string, options: NameIdRecord[]) =>
    options.find((option) => option.name === name)?.id;

  useEffect(() => {
    setPrivileges(value || []);
  }, [value]);

  const handleAdd = () => {
    if (selectedPrivilege) {
      const newPrivilege = {
        name: selectedPrivilege,
        id: findIdByName(selectedPrivilege, additionalData.privileges),
      };
      const updatedPrivilege = [...privileges, newPrivilege];
      setPrivileges(updatedPrivilege);
      api.setEditCellValue({ id, field, value: updatedPrivilege });
      // Clear inputs after adding
      setSelectedPrivilege('');
    }
  };

  const handleDelete = (index: number) => {
    const updatedPrivileges = privileges.filter(
      (_: any, idx: number) => idx !== index
    );
    setPrivileges(updatedPrivileges);
    api.setEditCellValue({ id, field, value: updatedPrivileges });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>{t('Privilege')}</InputLabel>
          <Select
            value={selectedPrivilege}
            onChange={(e) => setSelectedPrivilege(e.target.value)}
            displayEmpty
          >
            {additionalData.privileges.map((item: NameIdRecord) => (
              <MenuItem key={item.id} value={item.name}>
                {t(item.name)}
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
          value.map((privilege: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${t(privilege.name)}`} />
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
export default EditPrivilegesCell;
