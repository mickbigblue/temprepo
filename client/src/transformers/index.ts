import { EntityType } from '../types';
import {
  transformLines,
  untransformLines,
} from '../components/entities/PlantArea/Lines/dataTransformer';
import {
  transformSections,
  untransformSection,
} from '../components/entities/PlantArea/Sections/dataTransformer';
import { IdRecord } from '../interfaces/IdRecord';
import {
  transformShifts,
  untransformShifts,
} from '../components/entities/PlantArea/Shifts/dataTransformer';
import {
  transformWorkingHours,
  untransformWorkingHours,
} from '../components/entities/PlantArea/Worktime/dataTransformer';
import {
  transformCTBackpacks,
  untransformCTBackpacks,
} from '../components/entities/Rules/CTBackpacks/dataTransformer';
import {
  transformVehicleClasses,
  untransformVehicleClasses,
} from '../components/entities/Rules/VehicleClasses/dataTransformer';
import {
  transformDensities,
  untransformDensities,
} from '../components/entities/Rules/Densities/dataTransformer';
import {
  transformVehicleRules,
  untransformVehicleRules,
} from '../components/entities/Rules/VehicleRules/dataTransformer';
import {
  transformPartialRules,
  untransformParitalRules,
} from '../components/entities/Rules/PartialRules/dataTransformer';
import {
  transformCapacities,
  untransformCapacities,
} from '../components/entities/Program/Capacities/dataTransformer';
import {
  transformDistributions,
  untransformDistributions,
} from '../components/entities/Program/Distributions/dataTransformer';
import {
  transformQuantities,
  untransformQuantities,
} from '../components/entities/Program/Quantities/dataTransformer';
import {
  transformRoles,
  untransformRoles,
} from '../components/entities/Permissions/Roles/dataTransformer';
import {
  transformUsers,
  untransformUsers,
} from '../components/entities/Permissions/Users/dataTransformer';
import {
  transformFiles,
  untransformFiles,
} from '../components/entities/FileDownload/dataTransformer';
import {
  transformAuditCapacities,
  untransformAuditCapacities,
} from '../components/entities/DLZParameterization/AuditCapacities/dataTransformer';
import {
  transformAudits,
  untransformAudits,
} from '../components/entities/DLZParameterization/Audits/dataTransformer';

export const getTransformer = <T extends IdRecord>(entityType: EntityType) => {
  switch (entityType) {
    case 'lines':
      return transformLines as unknown as (data: { [key: string]: T[] }) => T[];
    case 'sections':
      return transformSections as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'shifts':
      return transformShifts as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'worktime':
      return transformWorkingHours as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'ctbackpacks':
      return transformCTBackpacks as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'vehicleclasses':
      return transformVehicleClasses as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'densities':
      return transformDensities as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'vehiclerules':
      return transformVehicleRules as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'partialrules':
      return transformPartialRules as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'capacities':
      return transformCapacities as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'distributions':
      return transformDistributions as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'quantities':
      return transformQuantities as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'auditcapacities':
      return transformAuditCapacities as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'audits':
      return transformAudits as unknown as (data: {
        [key: string]: T[];
      }) => T[];
    case 'roles':
      return transformRoles as unknown as (data: { [key: string]: T[] }) => T[];
    case 'users':
      return transformUsers as unknown as (data: { [key: string]: T[] }) => T[];
    case 'filedownload':
      return transformFiles as unknown as (data: { [key: string]: T[] }) => T[];
    default:
      return (data: any) => data;
  }
};

export const getUntransformer = <T extends IdRecord>(
  entityType: EntityType
) => {
  switch (entityType) {
    case 'lines':
      return untransformLines as unknown as (uiData: T) => T;
    case 'sections':
      return untransformSection as unknown as (uiData: T) => T;
    case 'shifts':
      return untransformShifts as unknown as (uiData: T) => T;
    case 'worktime':
      return untransformWorkingHours as unknown as (uiData: T) => T;
    case 'ctbackpacks':
      return untransformCTBackpacks as unknown as (uiData: T) => T;
    case 'vehicleclasses':
      return untransformVehicleClasses as unknown as (uiData: T) => T;
    case 'densities':
      return untransformDensities as unknown as (uiData: T) => T;
    case 'vehiclerules':
      return untransformVehicleRules as unknown as (uiData: T) => T;
    case 'partialrules':
      return untransformParitalRules as unknown as (uiData: T) => T;
    case 'capacities':
      return untransformCapacities as unknown as (uiData: T) => T;
    case 'distributions':
      return untransformDistributions as unknown as (uiData: T) => T;
    case 'quantities':
      return untransformQuantities as unknown as (uiData: T) => T;
    case 'auditcapacities':
      return untransformAuditCapacities as unknown as (uiData: T) => T;
    case 'audits':
      return untransformAudits as unknown as (
        uiData: T,
        parentId?: number
      ) => T;
    case 'roles':
      return untransformRoles as unknown as (uiData: T) => T;
    case 'users':
      return untransformUsers as unknown as (uiData: T) => T;
    case 'filedownload':
      return untransformFiles as unknown as (uiData: T) => T;
    default:
      return (data: any) => data;
  }
};
