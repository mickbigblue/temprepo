import { BackendRole, UIRole } from '../../../../interfaces/Roles';
import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformRoles: Transformer<BackendRole, UIRole> = (data: {
  [key: string]: any;
}): UIRole[] => {
  const transformedData = data.roles.map((role: BackendRole): UIRole => {
    return {
      id: role.id,
      role: role.name,
      description: role.description,
      privileges: role.privilegeIds.map((privId) => {
        return {
          id: privId,
          name: idToName(privId, data.privileges)!,
        };
      }),
      isNew: false,
    };
  });

  return transformedData;
};

export const untransformRoles: Untransformer<UIRole, BackendRole> = (
  uiData: UIRole
): BackendRole => {
  return {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.role,
    description: uiData.description,
    privilegeIds: uiData.privileges?.map((privilege) => privilege.id!),
  };
};
