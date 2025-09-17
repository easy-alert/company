import { Api } from '@services/api';

import { catchHandler } from '@utils/functions';

export async function getTutorials() {
  const api = '/tutorials';

  try {
    const response = await Api.get(api);

    return response.data;
  } catch (error) {
    catchHandler(error);

    return null;
  }
}
