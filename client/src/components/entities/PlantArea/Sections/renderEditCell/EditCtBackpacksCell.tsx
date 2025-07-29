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
import { BackendSection, UISection } from '../../../../../interfaces/Sections';
import { sortByName } from '../../../../../utils/nameIdSort';

const EditCTBackpacksCell = (
  props: GridRenderEditCellParams<UISection, UISection['ctBackpacks']>
) => {
  const { t } = useTranslation();

  const { value, id, api, field, additionalData } = props;

  const allCtBackpacks: NameIdRecord[] = additionalData.taktrucksaecke;
  const [ctBackpacks, setCtBackpacks] = useState<NameIdRecord[]>(value || []);
  const [selectedCtBackpackId, setSelectedCtBackpackId] = useState<
    number | null
  >(null);
  const [remainingCtBackpacks, setRemainingCtBackpacks] = useState<
    NameIdRecord[]
  >([]);
  const [currentValue, setCurrentValue] = useState<NameIdRecord[]>(value || []);

  useEffect(() => {
    const sortedCtBackpacks = sortByName(allCtBackpacks);
    const globallyAssignedCtBackpackIds: number[] =
      additionalData.abschnitte.flatMap(
        (obj: BackendSection) => obj.taktrucksaeckeIds
      );
    const currentValueIds = currentValue.map((entry) => entry.id);
    const combinedIds = new Set([
      ...globallyAssignedCtBackpackIds,
      ...currentValueIds,
    ]);
    const remainingCtBackpacks = sortedCtBackpacks.filter(
      (ctBp: NameIdRecord) => !combinedIds.has(ctBp.id!)
    );
    setRemainingCtBackpacks(remainingCtBackpacks);
  }, [additionalData, currentValue, allCtBackpacks]);

  const handleAddCtBackpack = () => {
    if (selectedCtBackpackId) {
      const addedCtBackpack = allCtBackpacks.find(
        (ctBp) => ctBp.id === selectedCtBackpackId
      )!;

      const updatedCtBackpacks = [...ctBackpacks, addedCtBackpack];
      setCtBackpacks(updatedCtBackpacks);

      api.setEditCellValue({ id, field, value: updatedCtBackpacks });

      setRemainingCtBackpacks((rem) =>
        rem.filter((ctb) => ctb.id !== addedCtBackpack.id)
      );

      setSelectedCtBackpackId(null);
    }
  };

  const handleDeleteCtBackpack = (deletedCtBackpackId: number) => {
    const deletedCtBackpack = allCtBackpacks.find(
      (ctBp) => ctBp.id === deletedCtBackpackId
    )!;
    const updatedCtBackpacks = ctBackpacks.filter(
      (ctBp) => ctBp.id !== deletedCtBackpackId
    );
    setCtBackpacks(updatedCtBackpacks);

    api.setEditCellValue({ id, field, value: updatedCtBackpacks });

    setRemainingCtBackpacks((rem) => sortByName([...rem, deletedCtBackpack]));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel>{t('CTBackpack')}</InputLabel>
          <Select
            value={selectedCtBackpackId}
            onChange={(e) => setSelectedCtBackpackId(+e.target.value!)}
            displayEmpty
          >
            {remainingCtBackpacks.map((ctBp: NameIdRecord) => (
              <MenuItem key={ctBp.id} value={ctBp.id}>
                {ctBp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={handleAddCtBackpack} color="primary">
          <AddBoxIcon />
        </IconButton>
      </Box>
      <List dense>
        {value &&
          sortByName(value).map((ctBp: NameIdRecord) => (
            <ListItem key={ctBp.id} divider>
              <ListItemText primary={ctBp.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteCtBackpack(ctBp.id!)}
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
export default EditCTBackpacksCell;
