import BackendDensity, { UIDensity } from '../../../../interfaces/Densities';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformDensities: Transformer<
  BackendDensity,
  UIDensity
> = (data: { [key: string]: any }): UIDensity[] => {
  const transformedData = data.densities.map(
    (density: BackendDensity): UIDensity => {
      return {
        id: density.id,
        name: density.name,
        vehicleRule: {
          id: density.fahrzeugRegelId,
          name: idToName(density.fahrzeugRegelId, data.fahrzeugRegeln)!,
        },
        densityMax: density.densityMax,
        densityWindow: density.densityWindow,
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformDensities: Untransformer<UIDensity, BackendDensity> = (
  uiData: UIDensity
): BackendDensity => {
  return {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    densityMax: uiData.densityMax,
    densityWindow: uiData.densityWindow,
    fahrzeugRegelId: uiData.vehicleRule?.id,
  };
};
