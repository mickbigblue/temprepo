import { NameIdRecord } from './NameIdRecord';

export interface BackendShift extends NameIdRecord {
  azintervallIds: number[];
}

export interface UIShift extends NameIdRecord {
  workingHours: NameIdRecord[];
  isNew: boolean;
}
