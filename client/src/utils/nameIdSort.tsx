import { NameIdRecord } from '../interfaces/NameIdRecord';

export const sortByName = (data: NameIdRecord[]) => {
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
};
