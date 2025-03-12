import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';
import { unMask } from '@utils/functions';

import type { UpdateUserValues } from '@screens/Account/Details/ModalUpdateUser';

interface IUpdateUser {
  data: UpdateUserValues;
}

export async function updateUser({ data }: IUpdateUser) {
  const uri = 'account/user';

  const body = {
    id: data.id,
    image: data.image,
    name: data.name,
    email: data.email,
    phoneNumber: unMask(data.phoneNumber),
    role: data.role,
    password: data.password,
    confirmPassword: data.confirmPassword,
    colorScheme: data.colorScheme,
    isBlocked: data.isBlocked,
  };

  try {
    const response = await Api.put(uri, body);

    const updatedUser = {
      image: response.data.updatedUser.image,
      name: response.data.updatedUser.name,
      email: response.data.updatedUser.email,
      phoneNumber: response.data.updatedUser.phoneNumber,
      role: response.data.updatedUser.role,
      colorScheme: response.data.updatedUser.colorScheme,
      createdAt: response.data.updatedUser.createdAt,
      lastAccess: response.data.updatedUser.lastAccess,
    };

    handleToastify(response);

    return updatedUser;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
