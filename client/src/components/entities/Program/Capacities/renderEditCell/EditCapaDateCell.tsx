import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

const EditCapaDateCell = (params: GridRenderEditCellParams) => {
  const { id, field, api, label, value, hasFocus } = params;
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>();
  const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);
  const dateFormat = i18n.language.startsWith('de')
    ? 'dd.MM.yyyy'
    : 'MM-dd-yyyy';

  const locale = i18n.language.startsWith('de') ? de : enUS;

  useEffect(() => {
    if (params.row.isNew) {
      const allRows = api.getAllRowIds().map((rowId) => api.getRow(rowId));
      const dates = allRows
        .map((r) => new Date(r.date).getTime())
        .filter((time) => !isNaN(time));
      const maxDate = new Date(Math.max(...dates));
      const newDate = new Date(maxDate);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);

      // Set the initial value in the api
      api.setEditCellValue({
        id,
        field,
        value: newDate,
      });
    }
  }, [api, field, id, params.row.isNew]);

  useEffect(() => {
    if (!params.row.isNew) {
      setDate(value ? new Date(value) : null);
    }
  }, [value, params.row.isNew]);

  useLayoutEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setDate(newValue);
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
      <DatePicker
        label={t(label)}
        value={date}
        onChange={handleChange}
        format={dateFormat}
      />
    </LocalizationProvider>
  );
};

export default EditCapaDateCell;
