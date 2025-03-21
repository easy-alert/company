import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IChecklist, TChecklistStatus } from '@customTypes/IChecklist';

interface ICreateChecklist {
  buildingId: string;
  checklistTemplateId?: string;
  newChecklist?: IChecklist;
  responsibleId: string;
  startDate: string;
  interval: string;
  status: TChecklistStatus;
}

export const createChecklist = async ({
  buildingId,
  checklistTemplateId,
  newChecklist,
  responsibleId,
  startDate,
  interval,
  status,
}: ICreateChecklist) => {
  const uri = `/checklists`;

  const body = {
    buildingId,
    checklistTemplateId,
    newChecklist,
    responsibleId,
    startDate,
    interval,
    status,
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
