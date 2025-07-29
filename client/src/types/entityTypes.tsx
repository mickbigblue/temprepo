import { GridColDef, GridSortDirection } from '@mui/x-data-grid-premium';

export interface ParentEntityConfigType {
  additionalDataUrl?: string;
  columns: GridColDef[];
  defaults: { [key: string]: any };
  endpoint: EndpointType;
  hiddenFields: string[];
  i18nKey: string;
  identifierKey: string;
  additionalIdentifierKey?: string;
  parentEndpoint?: EndpointType;
  subEntityConfig?: SubEntityConfigType;
  initialSort?: { field: string; sort: GridSortDirection }[];
}

export interface SubEntityConfigType {
  additionalDataUrl?: string;
  columns: GridColDef[];
  defaults: { [key: string]: any };
  endpoint: SubEndpointType;
  entityType: SubEntityType;
  hiddenFields: string[];
  i18nKey: string;
  identifierKey: string;
  additionalIdentifierKey?: string;
  parentEndpoint: EndpointType;
  initialSort?: { field: string; sort: GridSortDirection }[];
}

export type EntityConfigType = ParentEntityConfigType | SubEntityConfigType;

export interface ParentEntityEndpointMapping {
  sections: 'section';
  lines: 'line';
  shifts: 'shift';
  worktime: 'worktime';
  ctbackpacks: 'taktrucksack';
  vehicleclasses: 'vehiclecategory';
  vehiclerules: 'vehiclerule';
  densities: 'density';
  capacities: 'capacity';
  distributions: 'distribution';
  auditcapacities: 'auditcapacity';
  roles: 'role';
  users: 'user';
  filedownload: 'files';
}

export interface SubEntityEndpointMapping {
  partialrules: 'partialrule';
  quantities: 'quantity';
  audits: 'audit';
}

export type ParentEntityType = keyof ParentEntityEndpointMapping;
export type ParentEndpointType = ParentEntityEndpointMapping[ParentEntityType];

export type SubEntityType = keyof SubEntityEndpointMapping;
export type SubEndpointType = SubEntityEndpointMapping[SubEntityType];

export type EntityType = ParentEntityType | SubEntityType;
export type EndpointType = ParentEndpointType | SubEndpointType;

// Type guard for ParentEntityConfigType
export function isParentEntityConfig(
  config: any
): config is ParentEntityConfigType {
  return config && config.subEntityConfig !== undefined;
}

// Type guard for SubEntityConfigType
export function isSubEntityConfig(config: any): config is SubEntityConfigType {
  return config && config.parentEndpoint !== undefined;
}
