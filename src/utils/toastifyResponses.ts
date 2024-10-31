import { toast } from 'react-toastify';

interface IServerResponse {
  statusCode: number;
  message: string;
}

export const handleToastify = (serverResponse: IServerResponse) => {
  if (serverResponse.statusCode === 200) {
    toast.success(serverResponse.message);
  } else {
    toast.error(serverResponse.message);
  }
};
