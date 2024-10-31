import { Api } from '@services/api';

import { catchHandler } from '@utils/functions';

import type { IResponse } from '@customTypes/IResponse';
import type { IBuilding } from '@customTypes/IBuilding';
import type { ICategory } from '@customTypes/ICategory';

interface IBuildingsAndCategories extends IResponse {
  data: { Buildings: IBuilding[]; Categories: ICategory[] };
}

export const getBuildingsAndCategories = async () => {
  const uri = '/buildings/maintenances/occasional/auxiliarydata';

  try {
    const response: IBuildingsAndCategories = await Api.get(uri);

    const { Buildings: buildings, Categories: categories } = response.data;

    return { buildings, categories };
  } catch (error) {
    catchHandler(error);

    return { buildings: [], categories: [] }; // Return a default value in case of error
  }
};
