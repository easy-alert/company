// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

interface IPostTicketSignature {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  file: string;
}

interface IResponseData {
  location: string;
}

export async function postTicketSignature(file: IPostTicketSignature) {
  const uri = `/upload/base64`;

  const body = file;

  try {
    const response = await Api.post(uri, body);

    return response.data as IResponseData;
  } catch (error: any) {
    handleToastify(error.response);

    return { location: '' } as IResponseData;
  }
}
