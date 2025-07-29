// Base interface for all transformed data items
export interface TransformedData<TViewData, TEditData> {
  viewData: TViewData;
  editData: TEditData;
}
