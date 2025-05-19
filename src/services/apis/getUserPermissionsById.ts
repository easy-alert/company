// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

interface IGetUserPermissionsById {
  companyId?: string;
  userId: string;
}

export const getUserPermissionsById = async ({ companyId, userId }: IGetUserPermissionsById) => {
  const uri = `permissions/user-permissions/${userId}`;

  const params = {
    companyId,
  };

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error);

    return {
      userPermissions: [],
    };
  }
};
