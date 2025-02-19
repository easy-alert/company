import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IConfirmUser {
  token: string;
}

export const confirmUser = async ({ token }: IConfirmUser) => {
  const uri = '/buildings/notifications/contactconfirm';

  const body = {
    token,
  };

  try {
    const response = await Api.post(uri, body);
    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);

    throw new Error(error);
  }
};
