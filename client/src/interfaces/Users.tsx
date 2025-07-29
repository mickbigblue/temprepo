import { NameIdRecord } from './NameIdRecord';

export interface BackendUser extends NameIdRecord {
  description?: string;
  roleIds: number[];
}

export interface UIUser extends NameIdRecord {
  description?: string;
  roles: NameIdRecord[];
  isNew: false;
}
