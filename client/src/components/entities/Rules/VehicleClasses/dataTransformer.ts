import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import {
  BackendVehicleClass,
  UIVehicleClass,
} from '../../../../interfaces/VehicleClasses';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformVehicleClasses: Transformer<
  BackendVehicleClass,
  UIVehicleClass
> = (data: { [key: string]: any }): UIVehicleClass[] => {
  const transformedData = data.fahrzeugKlassen.map(
    (vehicleClass: BackendVehicleClass): UIVehicleClass => {
      return {
        id: vehicleClass.id,
        name: vehicleClass.name,
        vehicleRule: {
          id: vehicleClass.fahrzeugRegelId,
          name: idToName(vehicleClass.fahrzeugRegelId, data.fahrzeugRegeln)!,
        },
        priority: vehicleClass.prio,
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformVehicleClasses: Untransformer<
  UIVehicleClass,
  BackendVehicleClass
> = (uiData: UIVehicleClass): BackendVehicleClass => {
  let backendVehicleClass: BackendVehicleClass;

  backendVehicleClass = {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    prio: Number(uiData.priority) ?? -1,
    fahrzeugRegelId: uiData.vehicleRule.id,
  };
  return backendVehicleClass;
};
