import { BackendAudit, UIAudit } from './Audits';
import { NameIdRecord } from './NameIdRecord';

export interface BackendAuditCapacity extends NameIdRecord {
  attributName: string;
  maxPruefungen: number;
  prueffenster: number;
  abschnittId?: number;
  pruefumfaenge: BackendAudit[];
}

export interface UIAuditCapacity extends NameIdRecord {
  attribute: string;
  maxAudits: number;
  auditSegment: number;
  section: NameIdRecord | null;
  audits: UIAudit[];
  isNew: boolean;
}
