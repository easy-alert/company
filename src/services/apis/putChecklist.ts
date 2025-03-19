import { IChecklistItem } from '@customTypes/IChecklistItem';
import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

type TUpdateMode = 'this' | 'all' | 'thisAndFollowing' | '';

interface IPutChecklist {
  checklistId: string;
  userId?: string;
  checklistItems?: IChecklistItem[];
  status?: string;
  images?: any[];
  updateMode?: TUpdateMode;
}

export async function putChecklist({
  checklistId,
  userId,
  checklistItems,
  status,
  images,
  updateMode,
}: IPutChecklist) {
  const uri = `/checklists/${checklistId}`;

  const body = {
    userId,
    checklistItems,
    status,
    images,
    updateMode,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
