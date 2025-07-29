import {
  BackendPartialRule,
  UIPartialRule,
} from '../../../../interfaces/PartialRules';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';

export const transformPartialRules: Transformer<
  BackendPartialRule,
  UIPartialRule
> = (data: { [key: string]: any }): UIPartialRule[] => {
  const transformedData = data.fahrzeugTeilregeln.map(
    (partialRule: BackendPartialRule): UIPartialRule => {
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
  );

  return transformedData;
};

export const untransformParitalRules: Untransformer<
  UIPartialRule,
  BackendPartialRule
> = (uiData: UIPartialRule, parentId?: number): BackendPartialRule => {
  let backendPartialRule: BackendPartialRule;
  backendPartialRule = {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    regelId: uiData.isNew ? parentId : uiData.ruleId,
    baumuster: uiData.model,
    nedCode: uiData.productionCode,
    asfCode: uiData.asfCode,
    prodNr: uiData.productionNumber,
    vehNr: uiData.vehicleNumber,
    erweiterterFilter: uiData.extendedFilter,
  };
  return backendPartialRule;
};
