import { format } from 'date-fns';
import {
  BackendAuditCapacity,
  UIAuditCapacity,
} from '../../../../interfaces/AuditCapacities';
import { BackendAudit, UIAudit } from '../../../../interfaces/Audits';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformAuditCapacities: Transformer<
  BackendAuditCapacity,
  UIAuditCapacity
> = (data: { [key: string]: any }): UIAuditCapacity[] => {
  const transformedData = data.pruefkapazitaeten.map(
    (auditCapacity: BackendAuditCapacity): UIAuditCapacity => {
      return {
        id: auditCapacity.id,
        name: auditCapacity.name,
        attribute: auditCapacity.attributName,
        maxAudits: auditCapacity.maxPruefungen,
        auditSegment: auditCapacity.prueffenster,
        section: auditCapacity.abschnittId
          ? {
              id: auditCapacity.abschnittId,
              name: idToName(auditCapacity.abschnittId, data.abschnitte)!,
            }
          : null,
        audits: auditCapacity.pruefumfaenge.map((audit: BackendAudit) => {
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
          };
        }),
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformAuditCapacities: Untransformer<
  UIAuditCapacity,
  BackendAuditCapacity
> = (uiData: UIAuditCapacity): BackendAuditCapacity => {
  return {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    attributName: uiData.attribute,
    maxPruefungen: uiData.maxAudits,
    prueffenster: uiData.auditSegment,
    abschnittId: uiData.section?.id,
    pruefumfaenge: uiData.audits?.map((audit: UIAudit) => {
      return {
        ...(uiData.isNew ? {} : { id: audit.id }),
        name: audit.name,
        pruefkapazitaetId: audit.auditCapacityId,
        puCode: audit.puCode,
        fahrzeugregelId: audit.vehicleRule.id!,
        pruefQuote: audit.auditQuota,
        taktrucksack: audit.ctBackpack,
        werkssteuercode: audit.pcc,
        errechnetePruefschuld: audit.calculatedAuditDebt,
        userPruefschuld: audit.manualAuditDebt,
        userPruefschuldValidFrom: audit.validFrom
		  ? format(audit.validFrom, "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z'
          : null,
        userPruefschuldValidTo: audit.validTo
		  ? format(audit.validTo, "yyyy-MM-dd'T'HH:mm:ss.SSS") + 'Z'
          : null,
      };
    }),
  };
};
