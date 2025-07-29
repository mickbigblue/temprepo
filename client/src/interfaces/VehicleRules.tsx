import { NameIdRecord } from './NameIdRecord';
import { BackendPartialRule, UIPartialRule } from './PartialRules';

export interface BackendVehicleRule extends NameIdRecord {
  teilRegeln: BackendPartialRule[];
}

export interface UIVehicleRule extends NameIdRecord {
  partialRules: UIPartialRule[];
}
