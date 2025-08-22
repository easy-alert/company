import { toast } from 'react-toastify';
import { SUCCESS_STATUS_CODES } from './httpsStatusCode';

interface IServerResponse {
  status: number;
  data: {
    ServerMessage: {
      message: string;
    };
  };
}

interface IToastifyMessage {
  message: string;
  type: 'success' | 'warning' | 'error' | 'loading';
}

export const handleToastify = (serverResponse: IServerResponse, dismiss = true) => {
  if (dismiss) toast.dismiss();

  if (SUCCESS_STATUS_CODES.includes(serverResponse.status)) {
    toast.success(
      serverResponse?.data?.ServerMessage?.message || 'Operação realizada com sucesso',
      { toastId: 'success-toast' },
    );
  } else {
    toast.error(serverResponse?.data?.ServerMessage?.message || 'Erro ao realizar operação', {
      toastId: 'error-toast',
    });
  }
};

export const handleToastifyMessage = ({ message, type }: IToastifyMessage) => {
  toast.dismiss();

  switch (type) {
    case 'success':
      toast.success(message, { toastId: 'success-toast' });
      break;
    case 'warning':
      toast.warn(message, { toastId: 'warning-toast' });
      break;
    case 'error':
      toast.error(message, { toastId: 'error-toast' });
      break;
    case 'loading':
      toast.loading(message, { toastId: 'loading-toast' });
      break;
    default:
      break;
  }
};
