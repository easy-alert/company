import { IChecklistItem } from '@customTypes/IChecklistItem';
import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IPutChecklist {
  checklistId: string;
  checklistItems: IChecklistItem[];
  status: string;
  images?: any[];
}

export async function putChecklist({ checklistId, checklistItems, status, images }: IPutChecklist) {
  const uri = `/checklists/v2/${checklistId}`;

  const body = {
    checklistItems,
    status,
    images,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
