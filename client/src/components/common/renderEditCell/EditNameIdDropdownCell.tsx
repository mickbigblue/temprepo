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
import { sortByName } from '../../../utils/nameIdSort';

interface EditNameIdDropdownCellProps extends GridRenderEditCellParams {
  customHandleChange?: (event: SelectChangeEvent<string>) => void;
  includeEmptyValue?: boolean;
  displayEmpty?: boolean;
  uniqueSelection?: boolean;
}

const EditNameIdDropdownCell = (params: EditNameIdDropdownCellProps) => {
  const {
    id,
    field,
    api,
    value,
    options,
    label,
    customHandleChange,
    includeEmptyValue = false,
    displayEmpty = false,
    uniqueSelection = false,
  } = params;
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(value?.name || '');

  useEffect(() => {
    setSelectedValue(value?.name || '');
  }, [value]);

  const findIdByName = (name: string, options: NameIdRecord[]) =>
    options.find((option) => option.name === name)?.id;

  const getSelectedValues = () => {
    const selectedValues: string[] = [];
    api.getAllRowIds().forEach((rowId) => {
      if (rowId !== id) {
        const rowValue = api.getCellValue(rowId, field);
        if (rowValue?.name) {
          selectedValues.push(rowValue.name);
        }
      }
    });
    return selectedValues;
  };

  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;

      const updatedValue = newValue
        ? { id: findIdByName(newValue, options), name: newValue }
        : null;

      setSelectedValue(newValue);
      api.setEditCellValue(
        {
          id,
          field,
          value: updatedValue,
          debounceMs: 199,
        },
        event
      );
      if (customHandleChange) {
        customHandleChange(event);
      }
    },
    [api, id, options, field, customHandleChange]
  );

  const filteredOptions = uniqueSelection
    ? options.filter(
        (option: NameIdRecord) => !getSelectedValues().includes(option.name)
      )
    : options;

  const sortedOptions = filteredOptions ? sortByName(filteredOptions) : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '99%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl fullWidth>
          <InputLabel>{t(label)}</InputLabel>
          <Select
            value={selectedValue}
            onChange={handleChange}
            displayEmpty={displayEmpty}
          >
            {includeEmptyValue && (
              <MenuItem key="empty-value" value="">
                ===
              </MenuItem>
            )}
            {sortedOptions.map((item: NameIdRecord) => (
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

export default EditNameIdDropdownCell;
