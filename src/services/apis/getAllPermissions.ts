import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IGetAllPermissions {
  adminPermissions: boolean;
}

export const getAllPermissions = async ({ adminPermissions }: IGetAllPermissions) => {
  const uri = 'permissions';

  const params = {
    adminPermissions,
  };

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return {
      permissions: [],
      modules: [],
    };
  }
};
