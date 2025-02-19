import { Api } from '@services/api';

import { handleToastify, handleToastifyMessage } from '@utils/toastifyResponses';

interface ISendPhoneConfirmation {
  userId: string;
  link: string;
}

export async function sendPhoneConfirmation({ userId, link }: ISendPhoneConfirmation) {
  handleToastifyMessage({ message: 'Enviando confirmação...', type: 'loading' });
  const uri = 'users/confirm/phone';

  try {
    const response = await Api.post(uri, { userId, link });

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
