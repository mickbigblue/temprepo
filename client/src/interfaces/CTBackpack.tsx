import { NameIdRecord } from './NameIdRecord';

export interface BackendCTBackpack extends NameIdRecord {
  fahrzeugRegelId: number;
  teilmenge: number;
  taktRucksack: number;
  werkssteuercode: string;
  validFrom?: string;
  validTo?: string;
}

export interface UICTBackpack extends NameIdRecord {
  vehicleRule: NameIdRecord;
  subset: number;
  ctBackpack: number;
  pcc: string;
  validFrom: Date | null;
  validTo: Date | null;
}
