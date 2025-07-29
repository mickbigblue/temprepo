import { IdRecord } from './IdRecord';
import { NameIdRecord } from './NameIdRecord';

export interface BackendCapacity extends IdRecord {
  bandId: number;
  datum: string;
  schichtartId: number;
  kapazitaet: number;
  soaKapazitaet: number;
  ckdKapazitaet: number;
  skdKapazitaet: number;
}

export interface UICapacity extends IdRecord {
  line: NameIdRecord;
  date: Date;
  shift: NameIdRecord;
  capacity: number;
  soaCapacity: number;
  ckdCapacity: number;
  skdCapacity: number;
}
