import { NameIdRecord } from './NameIdRecord';

export interface BackendPartialRule extends NameIdRecord {
  regelId?: number;
  baumuster: string | null;
  nedCode: string | null;
  asfCode: string | null;
  prodNr: string | null;
  vehNr: string | null;
  erweiterterFilter: string | null;
}

export interface UIPartialRule extends NameIdRecord {
  ruleId: number;
  model: string | null;
  productionCode: string | null;
  asfCode: string | null;
  productionNumber: string | null;
  vehicleNumber: string | null;
  extendedFilter: string | null;
  isNew: boolean;
}
