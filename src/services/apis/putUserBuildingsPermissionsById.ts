import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IPermission } from '@customTypes/IPermission';

interface IUserBuildingsPermissions {
  buildingId: string;
  Permission?: IPermission;
}

interface IPutUserPermissionsById {
  companyId: string;
  userId: string;
  userBuildingsPermissions: IUserBuildingsPermissions[];
}

export async function putUserBuildingsPermissionsById({
  companyId,
  userId,
  userBuildingsPermissions,
}: IPutUserPermissionsById) {
  const uri = `permissions/user-buildings-permissions/${userId}`;

  const body = {
    companyId,
    userBuildingsPermissions,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
