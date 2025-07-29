import { NameIdRecord } from './NameIdRecord';

export interface BackendWorkingHour extends NameIdRecord {
  startUhrzeit: string;
  endeUhrzeit: string;
}

export interface UIWorkingHour extends NameIdRecord {
  startTime: Date | null;
  endTime: Date | null;
  isNew: boolean;
}
