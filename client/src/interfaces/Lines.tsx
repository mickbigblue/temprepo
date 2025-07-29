import { NameIdRecord } from './NameIdRecord';

export interface BackendLine extends NameIdRecord {
  dueCheckpoint: NameIdRecord | null;
  virtualPlanCheckpoint: NameIdRecord | null;
  virtualDueCheckpoint: NameIdRecord | null;
  dfzExtension?: number | null;
}

export interface UILine extends NameIdRecord {
  dueCP: NameIdRecord | null;
  vPlanCP: NameIdRecord | null;
  vDueCP: NameIdRecord | null;
  dfzExtension: number | null;
  isNew: boolean;
}
