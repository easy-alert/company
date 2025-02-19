import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IChecklist } from '@customTypes/IChecklist';

interface IGetBuildingByToken {
  token?: string;
}

export const getBuildingByToken = async ({ token }: IGetBuildingByToken) => {
  const uri = `buildings/list/detailsforconfirm`;

  const body = {
    token,
  };

  try {
    const response = await Api.post(uri, body);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return [{}] as IChecklist[];
  }
};
