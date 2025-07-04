import { IChecklistItem } from '@customTypes/IChecklistItem';
import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

type TUpdateMode = 'this' | 'all' | 'thisAndFollowing' | '';

interface IPutChecklist {
  checklistId: string;
  usersIds?: string[];
  checklistItems?: IChecklistItem[];
  observation?: string;
  status?: string;
  images?: any[];
  updateMode?: TUpdateMode;
}

export async function putChecklist({
  checklistId,
  usersIds,
  checklistItems,
  observation,
  status,
  images,
  updateMode,
}: IPutChecklist) {
  const uri = `/checklists/${checklistId}`;

  const body = {
    usersIds,
    checklistItems,
    observation,
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
