import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { de, enUS } from 'date-fns/locale';

const EditDateTimeCell = (params: GridRenderEditCellParams) => {
  const { id, field, disabled, api, label, value, hasFocus } = params;
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>();
  const [dateTime, setDateTime] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [resetKey, setResetKey] = useState(0);
  const dateTimeFormat = i18n.language.startsWith('de')
    ? 'dd.MM.yyyy HH:mm'
    : 'MM-dd-yyyy hh:mm';

  const locale = i18n.language.startsWith('de') ? de : enUS;

  useEffect(() => {
    setIsDisabled(params.disabled);
  }, [params.disabled]);

  useLayoutEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  useEffect(() => {
    setDateTime(params.value ? new Date(params.value) : null);
  }, [params.value, resetKey]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setDateTime(newValue);
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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <DateTimePicker
        key={`datetime-${label}-${resetKey}`}
        disabled={isDisabled}
        ampm={false}
        label={t(label)}
        value={dateTime}
        onChange={handleChange}
        format={dateTimeFormat}
      />
    </LocalizationProvider>
  );
};

export default EditDateTimeCell;
