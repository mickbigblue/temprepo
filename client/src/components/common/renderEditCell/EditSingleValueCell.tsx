import { TextField, TextFieldProps } from '@mui/material';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import React, {
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

interface EditSingleValueCellProps extends GridRenderEditCellParams {
  validate?: (value: string) => boolean;
  disabled?: () => boolean;
  decimalPlaces?: number;
}

const EditSingleValueCell = (props: EditSingleValueCellProps) => {
  const {
    id,
    row,
    field,
    disabled,
    value,
    hasFocus,
    label,
    validate,
    api,
    decimalPlaces,
  } = props;
  const inputRef = useRef<HTMLInputElement>();
  const [editValue, setEditValue] = useState(value ?? '');
  const [resetKey, setResetKey] = useState(0);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  useEffect(() => {
    setIsDisabled(props.disabled);
  }, [props.disabled]);

  useEffect(() => {
    setEditValue(props.value || '');
  }, [props.value, resetKey]);

  const handleChange = useCallback<NonNullable<TextFieldProps['onChange']>>(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value;

      if (typeof decimalPlaces === 'number') {
        newValue = newValue.replace(',', '.');

        if (decimalPlaces === 0) {
          if (newValue.includes('.')) return;
        } else {
          const regex = new RegExp(`^-?\\d*(\\.\\d{0,${decimalPlaces}})?$`);
          if (!regex.test(newValue)) return;
        }
      }

      if (validate && !validate(newValue)) return;

      setEditValue(newValue);
      api.setEditCellValue(
        {
          id,
          field,
          value: newValue,
          debounceMs: 200,
        },
        event
      );
    },
    [api, id, field, validate, decimalPlaces]
  );

  return (
    <TextField
      key={`datetime-${label}-${resetKey}`}
      disabled={isDisabled}
      inputRef={inputRef}
      label={t(label)}
      value={editValue}
      onChange={handleChange}
    />
  );
};

export default EditSingleValueCell;
