import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const EditTimeCell = (params: GridRenderEditCellParams) => {
  const { id, field, api, label, value, hasFocus } = params;
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>();
  const [time, setTime] = useState<Date | null>(value);

  useLayoutEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setTime(newValue);
      api.setEditCellValue(
        {
          id,
          field,
          value: newValue,
          debounceMs: 200,
        },
        new Event('change')
      );
    },
    [api, id, field]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={t(label)}
        value={time}
        views={['hours', 'minutes', 'seconds']}
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        }}
        onChange={handleChange}
        ampm={false}
      />
    </LocalizationProvider>
  );
};

export default EditTimeCell;
