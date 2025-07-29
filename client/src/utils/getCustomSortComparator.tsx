import {
  GridComparatorFn,
  GridSortCellParams,
  GridSortDirection,
} from '@mui/x-data-grid-premium';
import { NameIdRecord } from '../interfaces/NameIdRecord';

// Define the getSortComparator function
export const getCustomSortComparator = (
  sortDirection: GridSortDirection
): GridComparatorFn<any> => {
  const modifier = sortDirection === 'desc' ? -1 : 1;

  return (
    v1: any,
    v2: any,
    cellParams1: GridSortCellParams<any>,
    cellParams2: GridSortCellParams<any>
  ) => {
    const row1 = cellParams1.api.getRow(cellParams1.id) as any;
    const row2 = cellParams2.api.getRow(cellParams2.id) as any;
    const isNew1 = row1.isNew;
    const isNew2 = row2.isNew;

    // Ensure new rows are always at the top
    if (isNew1 && !isNew2) {
      return -1;
    }
    if (!isNew1 && isNew2) {
      return 1;
    }

    // Handle null and undefined values
    if ((v1 === null || v1 === undefined) && v2 !== null && v2 !== undefined) {
      return 1;
    }
    if (v1 !== null && v1 !== undefined && (v2 === null || v2 === undefined)) {
      return -1;
    }
    if (
      (v1 === null || v1 === undefined) &&
      (v2 === null || v2 === undefined)
    ) {
      return 0;
    }

    // Handle object comparison
    if (
      v1 &&
      typeof v1 === 'object' &&
      'name' in v1 &&
      v2 &&
      typeof v2 === 'object' &&
      'name' in v2
    ) {
      const name1 = (v1 as NameIdRecord).name;
      const name2 = (v2 as NameIdRecord).name;
      return modifier * name1.localeCompare(name2);
    }

    // Handle array comparison
    if (Array.isArray(v1) && Array.isArray(v2)) {
      const length1 = v1 ? v1.length : 0;
      const length2 = v2 ? v2.length : 0;
      return modifier * (length1 - length2);
    }

    // Handle simple string comparison
    if (typeof v1 === 'string' && typeof v2 === 'string') {
      return modifier * v1.localeCompare(v2);
    }

    // Handle simple number comparison
    if (typeof v1 === 'number' && typeof v2 === 'number') {
      return modifier * (v1 - v2);
    }

    // Handle boolean comparison
    if (typeof v1 === 'boolean' && typeof v2 === 'boolean') {
      return modifier * (v1 === v2 ? 0 : v1 ? 1 : -1);
    }

    // Handle date comparison
    if (v1 instanceof Date && v2 instanceof Date) {
      return modifier * (v1.getTime() - v2.getTime());
    }

    // Handle datetime comparison (ISO 8601 strings)
    if (
      typeof v1 === 'string' &&
      typeof v2 === 'string' &&
      !isNaN(Date.parse(v1)) &&
      !isNaN(Date.parse(v2))
    ) {
      return modifier * (Date.parse(v1) - Date.parse(v2));
    }

    return 0; // Default case if none of the above conditions are met
  };
};
