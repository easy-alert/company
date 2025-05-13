import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';
import type { IResponse } from '@customTypes/IResponse';

interface IGetChecklistTemplates {
  buildingId?: string;
}

interface IChecklistTemplatesResponse extends IResponse {
  data: IChecklistTemplate[];
}

export const getChecklistsTemplates = async ({ buildingId }: IGetChecklistTemplates) => {
  const uri = `/checklists/templates/list`;

  const params = {
    buildingId,
  };

  try {
    const response: IChecklistTemplatesResponse = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return [] as IChecklistTemplate[];
  }
};
