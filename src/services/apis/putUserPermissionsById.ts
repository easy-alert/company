import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IUserPermissions {
  id: string;
  name: string;
}

interface IPutUserPermissionsById {
  userId: string;
  userPermissions: IUserPermissions[];
}

export async function putUserPermissionsById({ userId, userPermissions }: IPutUserPermissionsById) {
  const uri = `permissions/user-permissions/${userId}`;

  const body = {
    userPermissions,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
