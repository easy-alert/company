import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface ILoginWithCompany {
  companyId: string;
  userId: string;
}

export async function loginWithCompany({ companyId, userId }: ILoginWithCompany) {
  const uri = '/auth/login-with-company';

  const body = {
    companyId,
    userId,
  };

  try {
    const response = await Api.post(uri, body);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);
    return null;
  }
}
