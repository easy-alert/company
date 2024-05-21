/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IFilterFunction, IRequestCategories, IRequestCategoriesForSelect } from './types';

export const requestCategories = async ({
  setLoading,
  setCategories,
  filter = '',
  setCategoriesForFilter,
}: IRequestCategories) => {
  await Api.get(`/categories/list?search=${filter}`)
    .then((res) => {
      setCategories(res.data);
      setCategoriesForFilter(res.data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      if (setLoading) setLoading(false);
      catchHandler(err);
    });
};

export const requestCategoriesForSelect = async ({
  setCategoriesOptions,
}: IRequestCategoriesForSelect) => {
  await Api.get('/categories/listforselect')
    .then((res) => {
      setCategoriesOptions(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const filterFunction = ({ setCategories, categoriesForFilter, filter }: IFilterFunction) => {
  if (filter !== '') {
    setCategories(() => {
      let newState = [...categoriesForFilter];
      newState = newState
        .map((item) => ({
          ...item,
          Maintenances: item.Maintenances.filter((maintenance) => {
            const m = maintenance;
            return (
              m.element.toLowerCase().includes(filter.toLowerCase()) ||
              m.activity.toLowerCase().includes(filter.toLowerCase()) ||
              m.frequency.toString().includes(filter) ||
              m.responsible.toLowerCase().includes(filter.toLowerCase()) ||
              m.source.toLowerCase().includes(filter.toLowerCase())
            );
          }),
        }))
        .filter(
          (item) =>
            item.Maintenances.length > 0 || item.name.toLowerCase().includes(filter.toLowerCase()),
        );
      return newState;
    });
  } else {
    setCategories(categoriesForFilter);
  }
};
