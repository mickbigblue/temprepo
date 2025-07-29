import { NameIdRecord } from '../interfaces/NameIdRecord';

// Single ID to Name
export const idToName = (
  id: number,
  idNamePairs: NameIdRecord[]
): string | null => {
  const pair = idNamePairs.find((pair) => pair.id === id);
  return pair ? pair.name : null;
};

// Array of IDs to Names
export const idsToNames = (
  ids: number[],
  idNamePairs: NameIdRecord[]
): (string | null)[] => {
  return ids.map((id) => idToName(id, idNamePairs));
};

// Filter out null values for non-matches
export const idsToNamesFilterNulls = (
  ids: number[],
  idNamePairs: NameIdRecord[]
): string[] => {
  return ids
    .map((id) => idToName(id, idNamePairs))
    .filter((name) => name) as string[];
};

// Single Name to ID
export const nameToId = (
  name: string,
  idNamePairs: NameIdRecord[]
): number | null => {
  const pair = idNamePairs.find((pair) => pair.name === name);
  return pair ? pair.id! : null;
};
