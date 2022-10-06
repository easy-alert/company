// LIBS
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';

// TYPES
import { IRequestUsersList } from './types';

// REQUESTS
export const requestUsersList = async ({
  setCompanies,
  setLoading,
  page,
  setCount,
  filter = '',
  setPage,
}: IRequestUsersList) => {
  await Api.get(`/backoffice/companies/list?page=${page}&search=${filter}`)
    .then((res) => {
      setCompanies(res.data.companiesAndOwners);
      setCount(res.data.companiesCount);
      if (setLoading) setLoading(false);
      if (setPage) setPage(1);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
