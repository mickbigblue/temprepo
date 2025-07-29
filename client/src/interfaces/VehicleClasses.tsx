import { NameIdRecord } from './NameIdRecord';

export interface BackendVehicleClass extends NameIdRecord {
  prio: number;
  fahrzeugRegelId: number;
}

export interface UIVehicleClass extends NameIdRecord {
  priority: number;
  vehicleRule: {
    id: number;
    name: string;
  };
  isNew: boolean;
}
