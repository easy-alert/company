// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IUser } from '@customTypes/IUser';

export const getUserById = async (userId: string) => {
  const uri = `/users/details`;

  const params = {
    userId,
  };

  try {
    const response = await Api.get(uri, { params });

    return response.data as IUser;
  } catch (error: any) {
    handleToastify(error);

    return {} as IUser;
  }
};
