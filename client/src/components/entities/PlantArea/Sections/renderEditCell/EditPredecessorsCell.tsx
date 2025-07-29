import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { NameIdRecord } from '../../../../../interfaces/NameIdRecord';
import { UIPredecessor } from '../../../../../interfaces/PredecessorRecord';
import { useTranslation } from 'react-i18next';
import { sortByName } from '../../../../../utils/nameIdSort';

const EditPredecessorsCell = (params: GridRenderEditCellParams) => {
  const { value, id, api, field, additionalData } = params;
  const { t } = useTranslation();
  const [predecessors, setPredecessors] = useState(value || []);
  const [section, setSection] = useState('');
  const [vehicleClass, setVehicleClass] = useState('');
  const [additionalInventory, setAdditionalInventory] = useState('');

  const findIdByName = (name: string, records: NameIdRecord[]): number => {
    return records.find((record) => record.name === name)!.id!;
  };

  const handleAddPredecessor = () => {
    const newPredecessor = {
      section: {
        id: findIdByName(section, additionalData.preAbschnitte),
        name: section,
      },
      vehicleClass: {
        id: findIdByName(vehicleClass, additionalData.fahrzeugklassen),
        name: vehicleClass,
      },
      additionalInventory: parseInt(additionalInventory, 10),
    };
    const updatedPredecessors = [...predecessors, newPredecessor];
    setPredecessors(updatedPredecessors);
    api.setEditCellValue({ id, field, value: updatedPredecessors });
    // Clear inputs after adding
    setSection('');
    setVehicleClass('');
    setAdditionalInventory('');
  };

  const handleDeletePredecessor = (index: number) => {
    const updatedPredecessors = predecessors.filter(
      (_: any, idx: number) => idx !== index
    );
    setPredecessors(updatedPredecessors);
    api.setEditCellValue({ id, field, value: updatedPredecessors });
  };

  const sortedSections = sortByName(additionalData.preAbschnitte);
  const sortedVehicleClasses = sortByName(additionalData.fahrzeugklassen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>{t('Section')}</InputLabel>
          <Select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            displayEmpty
          >
            {sortedSections.map((item: NameIdRecord) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>{t('VehicleClass')}</InputLabel>
          <Select
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value)}
            displayEmpty
          >
            {sortedVehicleClasses.map((item: NameIdRecord) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label={t('AdditionalCt')}
          type="number"
          value={additionalInventory}
          onChange={(e) => setAdditionalInventory(e.target.value)}
        />
        <IconButton onClick={handleAddPredecessor} color="primary">
          <AddBoxIcon />
        </IconButton>
      </Box>
      <List dense>
        {value &&
          value.map((pred: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`${pred.section.name} - ${pred.vehicleClass.name} - ${pred.additionalInventory || 0}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDeletePredecessor(index)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
export default EditPredecessorsCell;
