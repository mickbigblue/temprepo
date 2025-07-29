import {
  BackendPartialRule,
  UIPartialRule,
} from '../../../../interfaces/PartialRules';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import {
  BackendVehicleRule,
  UIVehicleRule,
} from '../../../../interfaces/VehicleRules';

export const transformVehicleRules: Transformer<
  BackendVehicleRule,
  UIVehicleRule
> = (data: { [key: string]: any }): UIVehicleRule[] => {
  const transformedData = data.fahrzeugRegeln.map(
    (vehicleRule: BackendVehicleRule): UIVehicleRule => {
      return {
        id: vehicleRule.id,
        name: vehicleRule.name,
        partialRules: vehicleRule.teilRegeln.map(
          (partialRule: BackendPartialRule) => {
            return {
              id: partialRule.id,
              name: partialRule.name,
              ruleId: partialRule.regelId!,
              model: partialRule.baumuster,
              productionCode: partialRule.nedCode,
              asfCode: partialRule.asfCode,
              productionNumber: partialRule.prodNr,
              vehicleNumber: partialRule.vehNr,
              extendedFilter: partialRule.erweiterterFilter,
              isNew: false,
            };
          }
        ),
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformVehicleRules: Untransformer<
  UIVehicleRule,
  BackendVehicleRule
> = (uiData: UIVehicleRule): BackendVehicleRule => {
  let backendVehicleRule: BackendVehicleRule;
  if (uiData.isNew) {
    backendVehicleRule = {
      name: uiData.name,
      teilRegeln: [
        {
          name: uiData.partialRuleName,
          baumuster: uiData.model,
          nedCode: uiData.productionCode,
          asfCode: uiData.asfCode,
          prodNr: uiData.productionNumber,
          vehNr: uiData.vehicleNumber,
          erweiterterFilter: uiData.extendedFilter,
        },
      ],
    };
  } else {
    backendVehicleRule = {
      id: uiData.id,
      name: uiData.name,
      teilRegeln: uiData.partialRules.map((partialRule: UIPartialRule) => {
        return {
          id: partialRule.id,
          name: partialRule.name,
          regelId: uiData.id,
          baumuster: partialRule.model,
          nedCode: partialRule.productionCode,
          asfCode: partialRule.asfCode,
          prodNr: partialRule.productionNumber,
          vehNr: partialRule.vehicleNumber,
          erweiterterFilter: partialRule.extendedFilter,
        };
      }),
    };
  }
  return backendVehicleRule;
};
