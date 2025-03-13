import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface ILogin {
  login: string;
  password: string;
}

export async function loginCompany({ login, password }: ILogin) {
  const uri = '/auth/login';

  const body = {
    login,
    password,
  };

  try {
    const response = await Api.post(uri, body);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);
    return null;
  }
}
