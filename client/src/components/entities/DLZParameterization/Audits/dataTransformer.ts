import { format } from 'date-fns';
import { BackendAudit, UIAudit } from '../../../../interfaces/Audits';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformAudits: Transformer<BackendAudit, UIAudit> = (data: {
  [key: string]: any;
}): UIAudit[] => {
  return data.pruefumfaenge.map((audit: BackendAudit): UIAudit => {
    return {
      id: audit.id,
      name: audit.name,
      auditCapacityId: audit.pruefkapazitaetId,
      puCode: audit.puCode,
      vehicleRule: {
        id: audit.fahrzeugregelId,
        name: idToName(audit.fahrzeugregelId, data.fahrzeugregeln)!,
      },
      auditQuota: audit.pruefQuote,
      ctBackpack: audit.taktrucksack,
      pcc: audit.werkssteuercode,
      calculatedAuditDebt: audit.errechnetePruefschuld,
      manualAuditDebt: audit.userPruefschuld,
      validFrom: audit.userPruefschuldValidFrom
        ? new Date(audit.userPruefschuldValidFrom)
        : null,
      validTo: audit.userPruefschuldValidTo
        ? new Date(audit.userPruefschuldValidTo)
        : null,
      isNew: false,
      cellsEditable: false,
    };
  });
};

export const untransformAudits: Untransformer<UIAudit, BackendAudit> = (
  uiData: UIAudit,
  parentId?: number
): BackendAudit => {
  return {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    pruefkapazitaetId:
      uiData.isNew && parentId ? parentId : +uiData.auditCapacityId,
    puCode: uiData.puCode,
    fahrzeugregelId: uiData.vehicleRule.id!,
    pruefQuote: uiData.auditQuota,
    taktrucksack: uiData.ctBackpack,
    werkssteuercode: uiData.pcc,
    errechnetePruefschuld: uiData.calculatedAuditDebt,
    userPruefschuld: uiData.manualAuditDebt,
    userPruefschuldValidFrom: uiData.validFrom
      ? format(uiData.validFrom, "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z'
      : null,
    userPruefschuldValidTo: uiData.validTo
    ? format(uiData.validTo, "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z'
      : null,
  };
};
