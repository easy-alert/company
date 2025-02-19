import { toast } from 'react-toastify';

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
  type: 'success' | 'warning' | 'error';
}

export const handleToastify = (serverResponse: IServerResponse) => {
  toast.dismiss();

  if (serverResponse.status === 200) {
    toast.success(serverResponse?.data?.ServerMessage?.message || 'Operação realizada com sucesso');
  } else {
    toast.error(serverResponse?.data?.ServerMessage?.message || 'Erro ao realizar operação');
  }
};

export const handleToastifyMessage = ({ message, type }: IToastifyMessage) => {
  toast.dismiss();

  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'warning':
      toast.warn(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      break;
  }
};
