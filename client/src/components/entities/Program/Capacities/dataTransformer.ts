import { format, parse } from 'date-fns';
import { BackendCapacity, UICapacity } from '../../../../interfaces/Capacities';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformCapacities: Transformer<
  BackendCapacity,
  UICapacity
> = (data: { [key: string]: any }): UICapacity[] => {
  const transformedData = data.kapazitaeten.map(
    (capacity: BackendCapacity): UICapacity => {
      return {
        id: capacity.id,
        line: {
          id: capacity.bandId,
          name: idToName(capacity.bandId, data.baender)!,
        },
        date: parse(capacity.datum, 'yyyy-MM-dd', new Date()),
        shift: {
          id: capacity.schichtartId,
          name: idToName(capacity.schichtartId, data.schichtarten)!,
        },
        capacity: capacity.kapazitaet,
        soaCapacity: capacity.soaKapazitaet,
        ckdCapacity: capacity.ckdKapazitaet,
        skdCapacity: capacity.skdKapazitaet,
        isNew: false,
      };
    }
  );

  return transformedData;
};

export const untransformCapacities: Untransformer<
  UICapacity,
  BackendCapacity
> = (uiData: UICapacity): BackendCapacity => {
  return {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    bandId: uiData.line.id!,
    datum: format(uiData.date, 'yyyy-MM-dd'),
    schichtartId: uiData.shift.id!,
    kapazitaet: +uiData.capacity,
    soaKapazitaet: +uiData.soaCapacity,
    ckdKapazitaet: +uiData.ckdCapacity,
    skdKapazitaet: +uiData.skdCapacity,
  };
};
