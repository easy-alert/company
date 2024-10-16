// REACT
import { useState, useEffect } from 'react';

// SERVICES
import { Api } from '../services/api';

// FUNCTIONS
import { catchHandler } from '../utils/functions';

// TYPES
import { ICategory } from '../types/ICategory';

export const useCategoriesByCompanyId = (companyId: string) => {
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [defaultCategories, setDefaultCategories] = useState<ICategory[]>([]);
  const [companyCategories, setCompanyCategories] = useState<ICategory[]>([]);

  const getCategoriesByCompanyId = async () => {
    await Api.get(`/categories/list/${companyId}`)
      .then((res) => {
        setAllCategories(res.data.allCategories);
        setDefaultCategories(res.data.defaultCategories);
        setCompanyCategories(res.data.companyCategories);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getCategoriesByCompanyId();
  }, []);

  return { allCategories, defaultCategories, companyCategories, getCategoriesByCompanyId };
};
