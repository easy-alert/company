import { Api } from '@services/api';

import { handleToastify, handleToastifyMessage } from '@utils/toastifyResponses';

interface ISendEmailConfirmation {
  userId: string;
  link: string;
}

export async function sendEmailConfirmation({ userId, link }: ISendEmailConfirmation) {
  handleToastifyMessage({ message: 'Enviando confirmação...', type: 'loading' });

  const uri = 'users/confirm/email';

  try {
    const response = await Api.post(uri, { userId, link });

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
