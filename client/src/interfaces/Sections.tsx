import { NameIdRecord } from './NameIdRecord';
import { BackendPredecessor, UIPredecessor } from './PredecessorRecord';

export interface BackendSection extends NameIdRecord {
  guiDisplayNumber: number;
  type: SectionType;
  takt: number | null;
  umlauf: number;
  bandId: number | null;
  vorgaenger: BackendPredecessor[] | null;
  taktrucksaeckeIds: number[];
  planFepu?: NameIdRecord | null;
  dueCheckpoint?: string | null;
  virtualPlanCheckpoint?: string | null;
  virtualDueCheckpoint?: string | null;
  virtualFzegKlassenIds: number[];
  densityId: number | null;
}

export interface ResponseSection {
  abschnitte: BackendSection[];
  preAbschnitte: NameIdRecord[];
  baender: NameIdRecord[];
  fahrzeugklassen: NameIdRecord[];
  taktrucksaecke: NameIdRecord[];
  densities: NameIdRecord[];
}

export interface UISection extends NameIdRecord {
  guiDisplayNumber: number;
  type: SectionType;
  jph: number | null;
  inventory: number;
  allCPs: {
    planCheckpoint: NameIdRecord | null;
    dueCheckpoint: string | null;
    virtualPlanCheckpoint: string | null;
    virtualDueCheckpoint: string | null;
  };
  virtualVehicleClasses: NameIdRecord[];
  sched: boolean;
  line: NameIdRecord | null;
  predecessors: UIPredecessor[] | null;
  ctBackpacks: NameIdRecord[];
  density: NameIdRecord;
  isNew: boolean;
}

export enum SectionType {
  HL = 'HL',
  SL = 'SL',
  VT = 'VT',
}
