import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export const getHomeFeedItems = async () => {
  const uri = 'home/feed';

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {};
  }
};
