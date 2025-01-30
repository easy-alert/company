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
  type: 'success' | 'error';
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

  if (type === 'success') {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
