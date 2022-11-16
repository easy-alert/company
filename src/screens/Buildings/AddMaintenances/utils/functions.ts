/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestCategories } from './types';

export const requestCategories = async ({
  setLoading,
  setCategories,
  filter = '',
}: IRequestCategories) => {
  await Api.get(`/categories/list?search=${filter}`)
    .then((res) => {
      setCategories(res.data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      if (setLoading) setLoading(false);
      catchHandler(err);
    });
};
