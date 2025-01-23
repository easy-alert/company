import { toast } from 'react-toastify';

interface IServerResponse {
  status: number;
  data: {
    ServerMessage: {
      message: string;
    };
  };
}

export const handleToastify = (serverResponse: IServerResponse) => {
  if (serverResponse.status === 200) {
    toast.success(serverResponse?.data?.ServerMessage?.message || 'Operação realizada com sucesso');
  } else {
    toast.error(serverResponse?.data?.ServerMessage?.message || 'Erro ao realizar operação');
  }
};
