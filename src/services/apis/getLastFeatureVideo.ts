import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export const getLastFeatureVideo = async () => {
  const uri = 'home/platform-videos/last-feature';

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {};
  }
};
