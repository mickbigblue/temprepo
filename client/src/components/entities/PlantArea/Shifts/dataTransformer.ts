import { NameIdRecord } from '../../../../interfaces/NameIdRecord';
import { BackendShift, UIShift } from '../../../../interfaces/Shifts';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformShifts: Transformer<BackendShift, UIShift> = (data: {
  [key: string]: any;
}): UIShift[] => {
  const transformedData = data.schichten.map((shift: BackendShift): UIShift => {
    return {
      id: shift.id,
      name: shift.name,
      workingHours: shift.azintervallIds.map((id: number) => {
        return { id: id, name: idToName(id, data.azintervalle)! };
      }),
      isNew: false,
    };
  });

  return transformedData;
};

export const untransformShifts: Untransformer<UIShift, BackendShift> = (
  uiData: UIShift
): BackendShift => {
  let backendShift: BackendShift;

  if (uiData.isNew) {
    backendShift = {
      name: uiData.name,
      azintervallIds: uiData.workingHours
        ? uiData.workingHours.map(
            (workingHour: NameIdRecord) => workingHour.id!
          )
        : [],
    };
  } else {
    backendShift = {
      id: uiData.id,
      name: uiData.name,
      azintervallIds: uiData.workingHours
        ? uiData.workingHours.map(
            (workingHour: NameIdRecord) => workingHour.id!
          )
        : [],
    };
  }
  return backendShift;
};
