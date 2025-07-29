import { parse, format } from 'date-fns';
import {
  BackendCTBackpack,
  UICTBackpack,
} from '../../../../interfaces/CTBackpack';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformCTBackpacks: Transformer<
  BackendCTBackpack,
  UICTBackpack
> = (data: { [key: string]: any }): UICTBackpack[] => {
  const transformedData = data.taktrucksaecke.map(
    (ctBackpack: BackendCTBackpack): UICTBackpack => {
      return {
        id: ctBackpack.id,
        name: ctBackpack.name,
        vehicleRule: {
          id: ctBackpack.fahrzeugRegelId,
          name: idToName(ctBackpack.fahrzeugRegelId, data.fahrzeugRegeln)!,
        },
        subset: ctBackpack.teilmenge,
        ctBackpack: ctBackpack.taktRucksack,
        pcc: ctBackpack.werkssteuercode,
        validFrom: ctBackpack.validFrom
          ? parse(ctBackpack.validFrom, 'yyyy-MM-dd', new Date())
          : null,
        validTo: ctBackpack.validTo
          ? parse(ctBackpack.validTo, 'yyyy-MM-dd', new Date())
          : null,
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformCTBackpacks: Untransformer<
  UICTBackpack,
  BackendCTBackpack
> = (uiData: UICTBackpack): BackendCTBackpack => {
  let backendCTBackpack: BackendCTBackpack;

  backendCTBackpack = {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    fahrzeugRegelId: uiData.vehicleRule.id!,
    teilmenge: uiData.subset,
    taktRucksack: uiData.ctBackpack,
    werkssteuercode: uiData.pcc,
    validFrom: uiData.validFrom
      ? format(uiData.validFrom, 'yyyy-MM-dd')
      : undefined,
    validTo: uiData.validTo ? format(uiData.validTo, 'yyyy-MM-dd') : undefined,
  };
  return backendCTBackpack;
};
