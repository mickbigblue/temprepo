import { NameIdRecord } from './NameIdRecord';
import { BackendQuantity, UIQuantity } from './Quantities';

export interface BackendDistribution {
  id?: number;
  vehicleClassId: number;
  predecessorId: number;
  sectionId: number;
  quantities: BackendQuantity[];
}

export interface UIDistribution {
  id?: number;
  section: NameIdRecord;
  vehicleClass: NameIdRecord;
  predecessor: NameIdRecord;
  quantities: UIQuantity[];
  isNew: boolean;
}
