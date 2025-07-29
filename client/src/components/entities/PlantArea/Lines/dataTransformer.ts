import { BackendLine, UILine } from '../../../../interfaces/Lines';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';

export const transformLines: Transformer<BackendLine, UILine> = (data: {
  [key: string]: any;
}): UILine[] => {
  const transformedData = data.baender.map((line: BackendLine): UILine => {
    return {
      id: line.id,
      name: line.name,
      dueCP: line.dueCheckpoint,
      vPlanCP: line.virtualPlanCheckpoint,
      vDueCP: line.virtualDueCheckpoint,
      dfzExtension: line.dfzExtension || null,
      isNew: false,
    };
  });

  return transformedData;
};

export const untransformLines: Untransformer<UILine, BackendLine> = (
  uiData: UILine
): BackendLine => {
  const commonFields = {
    name: uiData.name,
    dueCheckpoint: uiData.dueCP ? { name: uiData.dueCP.name } : { name: '' },
    virtualPlanCheckpoint: uiData.vPlanCP
      ? { name: uiData.vPlanCP.name }
      : null,
    virtualDueCheckpoint: uiData.vDueCP ? { name: uiData.vDueCP.name } : null,
    dfzExtension: uiData.dfzExtension ? +uiData.dfzExtension : 0,
  };

  const idField = uiData.isNew
    ? {}
    : {
        id: uiData.id,
        dueCheckpoint: uiData.dueCP
          ? { id: uiData.dueCP.id, name: uiData.dueCP.name }
          : null,
        virtualPlanCheckpoint: uiData.vPlanCP
          ? { id: uiData.vPlanCP.id, name: uiData.vPlanCP.name }
          : null,
        virtualDueCheckpoint: uiData.vDueCP
          ? { id: uiData.vDueCP.id, name: uiData.vDueCP.name }
          : null,
      };

  return {
    ...commonFields,
    ...idField,
  };
};
// export const untransformLines: Untransformer<UILine, BackendLine> = (
//   uiData: UILine
// ): BackendLine => {
//   let backendLine: BackendLine;

//   if (uiData.isNew) {
//     backendLine = {
//       name: uiData.name,
//       dueCheckpoint: uiData.dueCP ? { name: uiData.dueCP.name } : { name: '' },
//       virtualPlanCheckpoint: uiData.vPlanCP
//         ? { name: uiData.vPlanCP.name }
//         : null,
//       virtualDueCheckpoint: uiData.vDueCP ? { name: uiData.vDueCP.name } : null,
//       dfzExtension: uiData.dfzExtension ? +uiData.dfzExtension : 0,
//     };
//   } else {
//     backendLine = {
//       id: uiData.id,
//       name: uiData.name,
//       dueCheckpoint: uiData.dueCP
//         ? { id: uiData.dueCP.id, name: uiData.dueCP.name }
//         : null,
//       virtualPlanCheckpoint: uiData.vPlanCP
//         ? { id: uiData.vPlanCP.id, name: uiData.vPlanCP.name }
//         : null,
//       virtualDueCheckpoint: uiData.vDueCP
//         ? { id: uiData.vDueCP.id, name: uiData.vDueCP.name }
//         : null,
//       dfzExtension: uiData.dfzExtension ? +uiData.dfzExtension : 0,
//     };
//   }
//   return backendLine;
// };
