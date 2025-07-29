export type OperationType =
  | ''
  | 'create'
  | 'update'
  | 'delete'
  | 'warningcreate'
  | 'warningupdate';

export interface RouteType {
  path: string;
  element: React.ReactNode;
}

export type RouteConfigType = RouteType[];
