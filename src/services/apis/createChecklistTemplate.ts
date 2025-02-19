import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IChecklistTemplateItem } from '@customTypes/IChecklistTemplateItem';

interface ICreateChecklistTemplate {
  buildingId: string;
  name: string;
  description?: string;
  items: IChecklistTemplateItem[];
}

export const createChecklistTemplate = async ({
  buildingId,
  name,
  description,
  items,
}: ICreateChecklistTemplate) => {
  const uri = `/checklists/template/${buildingId}`;

  const body = {
    name,
    description,
    items,
  };

  try {
    const response = await Api.post(uri, body);

    handleToastify({
      status: 200,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);
    return null;
  }
};
