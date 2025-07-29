import {
  getGridStringOperators,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
} from '@mui/x-data-grid-premium';
import i18n from '../i18n';
import { GridApiCommunity } from '@mui/x-data-grid/models/api/gridApiCommunity';
import { MutableRefObject } from 'react';

const { t } = i18n;

function extractNames(value: unknown): string[] {
  // If we have an array of NameIdRecords
  if (Array.isArray(value)) {
    return value
      .filter(
        (item) => typeof item === 'object' && item !== null && 'name' in item
      )
      .map((item) => item.name ?? '');
  }

  // If it's a single { id, name } object
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return [(value as { name?: string }).name ?? ''];
  }

  // Otherwise we just convert it to a single string
  return [String(value ?? '')];
}

// We get the base string operators
const baseStringOperators = getGridStringOperators();

// Override them to handle objects with a "name" property
export const getCustomFilterComparator: GridFilterOperator[] =
  baseStringOperators.map((operator) => ({
    ...operator,
    getApplyFilterFn: (filterItem: GridFilterItem, colDef: GridColDef) => {
      const baseFn = operator.getApplyFilterFn?.(filterItem, colDef);
      if (!baseFn) {
        // e.g. user typed nothing in filter
        return null;
      }
      // Return new function that extracts .name before delegating
      return (
        value: unknown,
        row: any,
        column: GridColDef,
        apiRef: MutableRefObject<GridApiCommunity>
      ) => {
        const allNames =
          column.field === 'privileges'
            ? extractNames(value).map((raw: string) => t(raw))
            : extractNames(value);

        return allNames.some((oneName) => baseFn(oneName, row, column, apiRef));
      };
    },
  }));
