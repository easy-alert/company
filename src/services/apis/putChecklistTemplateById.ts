import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

export async function putChecklistTemplateById(checklistTemplate: IChecklistTemplate) {
  const { id } = checklistTemplate;
  const uri = `/checklists/template/${id}`;

  const body = {
    ...checklistTemplate,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);

    return response.data.updatedChecklistTemplate as IChecklistTemplate;
  } catch (error: any) {
    handleToastify(error.response);

    return {} as IChecklistTemplate;
  }
}
