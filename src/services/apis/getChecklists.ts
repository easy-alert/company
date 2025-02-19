import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IChecklist } from '@customTypes/IChecklist';
import type { IResponse } from '@customTypes/IResponse';

interface IGetChecklists {
  buildingId: string;
  checklistId: string;
}

interface IChecklistTemplatesResponse extends IResponse {
  data: IChecklist[];
}

export const getChecklists = async ({ buildingId, checklistId }: IGetChecklists) => {
  const uri = `/checklists/v2/${buildingId}/${checklistId}`;

  try {
    const response: IChecklistTemplatesResponse = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return [{}] as IChecklist[];
  }
};
