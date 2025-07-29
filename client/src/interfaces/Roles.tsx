import { NameIdRecord } from './NameIdRecord';

export interface BackendRole extends NameIdRecord {
  description?: string;
  privilegeIds: number[];
}

export interface UIRole extends Omit<NameIdRecord, 'name'> {
  role: string;
  description?: string;
  privileges: NameIdRecord[];
  isNew: boolean;
}
