import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteChecklistTemplate {
  checklistTemplateId: string;
}

export async function deleteChecklistTemplate({ checklistTemplateId }: IDeleteChecklistTemplate) {
  const uri = `checklists/template/${checklistTemplateId}`;

  try {
    const response = await Api.delete(uri);

    handleToastify({
      status: 200,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);
    return null;
  }
}
