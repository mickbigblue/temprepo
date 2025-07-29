import { IdRecord } from './IdRecord';
import { NameIdRecord } from './NameIdRecord';

export interface BackendPredecessor extends IdRecord {
  abschnittId: number;
  fahrzeugKlassenId: number;
  additionalTaktZuschlag: number;
}

export interface UIPredecessor extends IdRecord {
  section: NameIdRecord;
  vehicleClass: NameIdRecord;
  additionalInventory: number;
}
