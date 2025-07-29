import { Transformer, Untransformer } from '../../../../interfaces/Transformer';
import { BackendUser, UIUser } from '../../../../interfaces/Users';
import { idToName } from '../../../../utils/transformerHelpers';

export const transformUsers: Transformer<BackendUser, UIUser> = (data: {
  [key: string]: any;
}): UIUser[] => {
  const transformedData = data.users.map((user: BackendUser): UIUser => {
    return {
      id: user.id,
      name: user.name,
      description: user.description,
      roles: user.roleIds.map((roleId) => {
        return {
          id: roleId,
          name: idToName(roleId, data.roles)!,
        };
      }),
      isNew: false,
    };
  });

  return transformedData;
};

export const untransformUsers: Untransformer<UIUser, BackendUser> = (
  uiData: UIUser
): BackendUser => {
  return {
    ...(uiData.isNew ? {} : { id: uiData.id }),
    name: uiData.name,
    description: uiData.description,
    roleIds: uiData.roles.map((role) => role.id!),
  };
};
