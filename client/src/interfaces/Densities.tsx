import { NameIdRecord } from './NameIdRecord';

export default interface BackendDensity extends NameIdRecord {
  densityMax: number;
  densityWindow: number;
  fahrzeugRegelId: number;
}

export interface UIDensity extends NameIdRecord {
  densityMax: number;
  densityWindow: number;
  vehicleRule: {
    id: number;
    name: string;
  };
  isNew: boolean;
}
