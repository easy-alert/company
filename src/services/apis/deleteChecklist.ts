import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

interface IDeleteChecklist {
  checklistId: string;
  deleteMode: TDeleteMode;
}

export async function deleteChecklist({ checklistId, deleteMode }: IDeleteChecklist) {
  const uri = `/checklists/v2/${checklistId}/${deleteMode}`;

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
