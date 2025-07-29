import { TextField, TextFieldProps } from '@mui/material';
import {
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UISection } from '../../../../../interfaces/Sections';

const EditPlanCPCell = (
  props: GridRenderEditCellParams<UISection, UISection['allCPs']>
) => {
  const { id, field, value, hasFocus } = props;
  const apiRef = useGridApiContext();
  const inputRef = useRef<HTMLInputElement>();
  const [allCPsState, setAllCPsState] = useState(
    value || {
      planCheckpoint: null,
      virtualDueCheckpoint: null,
      virtualPlanCheckpoint: null,
      dueCheckpoint: null,
    }
  );
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const handleChange = useCallback<NonNullable<TextFieldProps['onChange']>>(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!allCPsState) return;
      const newValue = event.target.value;
      if (isNaN(Number(newValue))) return;
      const newAllCPsState: UISection['allCPs'] = {
        ...allCPsState,
        planCheckpoint: { ...allCPsState.planCheckpoint, name: newValue },
      };
      setAllCPsState(newAllCPsState);
      apiRef.current?.setEditCellValue(
        {
          id,
          field,
          value: newAllCPsState,
          debounceMs: 200,
        },
        event
      );
    },
    [apiRef, field, id, allCPsState]
  );

  return (
    <TextField
      inputRef={inputRef}
      label={t('PlanCP')}
      value={allCPsState?.planCheckpoint?.name || ''}
      onChange={handleChange}
    />
  );
};

export default EditPlanCPCell;
