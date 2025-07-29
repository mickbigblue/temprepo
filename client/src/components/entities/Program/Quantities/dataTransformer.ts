import { format, parse } from 'date-fns';
import {
  BackendLineWithCapacity,
  BackendQuantity,
  UIQuantity,
} from '../../../../interfaces/Quantities';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformQuantities: Transformer<
  BackendQuantity,
  UIQuantity
> = (data: { [key: string]: any }): UIQuantity[] => {
  return data.quantities.map((quantity: BackendQuantity): UIQuantity => {
    return {
      id: quantity.date,
      date: quantity.date
        ? parse(quantity.date, 'yyyy-MM-dd', new Date())
        : null,
      relevantLinesWithCapacity:
        quantity.relevantLinesWithCapacity?.map(
          (relevantLine: BackendLineWithCapacity) => {
            return {
              id: relevantLine.lineId,
              name: idToName(relevantLine.lineId, data.lines)!,
              capacity: relevantLine.capacity,
            };
          }
        ) || [],
      searchWindow: quantity.searchWindow,
      quantity: quantity.quantity,
      isNew: false,
    };
  });
};

export const untransformQuantities: Untransformer<
  UIQuantity,
  BackendQuantity
> = (uiData: UIQuantity): BackendQuantity => {
  return {
    date: format(uiData.date!, 'yyyy-MM-dd'),
    quantity: uiData.quantity === '' ? null : uiData.quantity,
  };
};
