import { TextField, TextFieldProps } from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditNameIdCellProps extends GridRenderEditCellParams {
  validate?: (value: string) => boolean;
}

const EditNameIdCell = (props: EditNameIdCellProps) => {
  const { id, field, value, hasFocus, label, validate, api } = props;
  const inputRef = useRef<HTMLInputElement>();
  const [editValue, setEditValue] = useState(value?.name || '');
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const handleChange = useCallback<NonNullable<TextFieldProps['onChange']>>(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      const updatedValue = newValue ? { ...value, name: newValue } : null;

      setEditValue(newValue);
      api.setEditCellValue(
        {
          id,
          field,
          value: updatedValue,
          debounceMs: 200,
        },
        event
      );
    },
    [api, id, field, value]
  );

  return (
    <TextField
      inputRef={inputRef}
      label={t(label)}
      value={editValue}
      onChange={handleChange}
    />
  );
};

export default EditNameIdCell;
