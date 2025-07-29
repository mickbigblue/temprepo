import { NameIdRecord } from '../../interfaces/NameIdRecord';

export class UiUtils {
  public static IdToNameFromArray = (
    namedArray: NameIdRecord[],
    id?: number
  ): string => {
    let name = '';
    namedArray.forEach((item: NameIdRecord) => {
      if (item.id === id) {
        name = item.name;
      }
    });
    return name;
  };

  public static IdArrayToName = (
    namedArray: NameIdRecord[],
    ids: number[]
  ): string => {
    let name = '';

    ids.forEach((id: number) => {
      name = UiUtils.IdToNameFromArray(namedArray, id) + ', ' + name;
    });

    if (name.length > 0) {
      name = name.substring(0, name.length - 2);
    }
    return name;
  };

  public static IdArrayToNameAsList = (
    namedArray: NameIdRecord[],
    ids: number[]
  ): string[] => {
    const nameList: string[] = [];
    ids.forEach((id: number) => {
      nameList.push(UiUtils.IdToNameFromArray(namedArray, id));
    });
    return nameList;
  };

  public static nameToId = (
    namedArray: NameIdRecord[],
    name: string | null | undefined
  ): number => {
    if (name === null || name === undefined) {
      return 0;
    }

    let id = 0;
    namedArray.forEach((item: NameIdRecord) => {
      if (item.name === name) {
        id = item.id!;
      }
    });
    return id;
  };
}
