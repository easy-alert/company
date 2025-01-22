// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

export const getUserBuildingsPermissionsById = async (userId: string) => {
  const uri = `permissions/user-buildings-permissions/${userId}`;

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error);

    return {
      userPermissions: [],
    };
  }
};
