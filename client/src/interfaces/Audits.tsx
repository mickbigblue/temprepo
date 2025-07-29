import { NameIdRecord } from './NameIdRecord';

export interface BackendAudit extends NameIdRecord {
  pruefkapazitaetId: number;
  puCode: string;
  fahrzeugregelId: number;
  pruefQuote: number;
  taktrucksack: number;
  werkssteuercode: string;
  errechnetePruefschuld: number | null;
  userPruefschuld: number | null;
  userPruefschuldValidFrom: string | null;
  userPruefschuldValidTo: string | null;
}

export interface UIAudit extends NameIdRecord {
  auditCapacityId: number;
  puCode: string;
  vehicleRule: NameIdRecord;
  auditQuota: number;
  ctBackpack: number;
  pcc: string;
  calculatedAuditDebt: number | null;
  manualAuditDebt: number | null;
  validFrom: Date | null;
  validTo: Date | null;
  isNew: boolean;
  cellsEditable?: boolean;
}
