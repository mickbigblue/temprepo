export interface Transformer<TInput, TOutput> {
  (data: { [key: string]: any }): TOutput[];
}

export interface Untransformer<U, B> {
  (uiData: U, parentId?: number): B;
}
