// REACT
import { useState, useEffect } from 'react';

// SERVICES
import { Api } from '@services/api';

// FUNCTIONS
import { catchHandler } from '@utils/functions';

// TYPES
import type { ICategory } from '@customTypes/ICategory';
import type { IResponse } from '@customTypes/IResponse';

interface IResponseData extends IResponse {
  data: {
    allCategories: ICategory[];
    defaultCategories: ICategory[];
    companyCategories: ICategory[];
  };
}

export const useCategoriesByCompanyId = (companyId: string) => {
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [defaultCategories, setDefaultCategories] = useState<ICategory[]>([]);
  const [companyCategories, setCompanyCategories] = useState<ICategory[]>([]);

  const getCategoriesByCompanyId = async () => {
    const uri = `/categories/listByCompanyId/${companyId}`;

    try {
      const response: IResponseData = await Api.get(uri);

      setAllCategories(response.data.allCategories);
      setDefaultCategories(response.data.defaultCategories);
      setCompanyCategories(response.data.companyCategories);
    } catch (error) {
      catchHandler(error);
    }
  };

  useEffect(() => {
    getCategoriesByCompanyId();
  }, []);

  return { allCategories, defaultCategories, companyCategories, getCategoriesByCompanyId };
};
