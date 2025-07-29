import {
  GridApi,
  GridCsvExportOptions,
  GridRowId,
} from '@mui/x-data-grid-premium';
import {
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
} from '@mui/x-data-grid-premium';
import { GridStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';
import Papa from 'papaparse';

const formatDate = (value: any): string => {
  if (value instanceof Date) {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(value);
  }
  return value;
};

const exportCsv = (
  apiRef: React.RefObject<GridApi>,
  options?: GridCsvExportOptions
) => {
  const rows = gridFilteredSortedRowIdsSelector(
    apiRef as React.MutableRefObject<{
      state: GridStatePremium;
      instanceId: { id: number };
    }>
  );
  const columns = gridVisibleColumnFieldsSelector(
    apiRef as React.MutableRefObject<{
      state: GridStatePremium;
      instanceId: { id: number };
    }>
  );

  const csvRows = rows.map((id) => {
    const row: { [key: string]: any } = {};
    columns.forEach((field) => {
      const cellParams = apiRef.current?.getCellParams(id, field);
      let value = cellParams?.value;
      if (value instanceof Date) {
        value = formatDate(value);
      } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      row[field] = value;
    });
    return row;
  });

  const csv = Papa.unparse(csvRows);
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(csvBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const exportTxt = (apiRef: React.MutableRefObject<GridApi>) => {
  const rows = gridFilteredSortedRowIdsSelector(apiRef);
  const columns = gridVisibleColumnFieldsSelector(apiRef);

  const txtRows = rows.map((id) => {
    const row: { [key: string]: any } = {};
    columns.forEach((field) => {
      const cellParams = apiRef.current.getCellParams(id, field);
      let value = cellParams.value;
      if (value instanceof Date) {
        value = formatDate(value);
      } else if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      row[field] = value;
    });
    return row;
  });

  const txt = txtRows.map((row) => Object.values(row).join('\t')).join('\n');
  const txtBlob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(txtBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.txt';
  a.click();
  URL.revokeObjectURL(url);
};

export { exportCsv, exportTxt };
