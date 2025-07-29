export type BackendLineWithCapacity = {
  lineId: number;
  lineName: string;
  capacity: number;
};

export type UILineWithCapacity = {
  id: number;
  name: string;
  capacity: number;
};

export interface BackendQuantity {
  date: string;
  relevantLinesWithCapacity?: BackendLineWithCapacity[];
  searchWindow?: number;
  quantity: number | string | null;
}

export interface UIQuantity {
  id: string;
  date: Date | null;
  relevantLinesWithCapacity: UILineWithCapacity[];
  searchWindow?: number;
  quantity: number | string | null;
  isNew: boolean;
}
