import { toast } from 'react-toastify';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { IRequestConfirmPhone } from './types';

export const requestConfirmData = async ({ token, navigate }: IRequestConfirmPhone) => {
  await Api.post('/buildings/notifications/contactconfirm', {
    token,
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      navigate('/login');
    });
};
