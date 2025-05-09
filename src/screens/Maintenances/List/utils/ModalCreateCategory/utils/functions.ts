import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Api } from '@services/api';
import { catchHandler } from '@utils/functions';
import { IRequestCreateCategory } from './types';

export const requestCreateCategory = async ({
  values,
  setCategories,
  categories,
  setOnQuery,
  setModal,
}: IRequestCreateCategory) => {
  setOnQuery(true);

  await Api.post('/categories/create', {
    name: values.categoryName,
  })
    .then((res) => {
      toast.dismiss();

      const tempCategory = categories;

      tempCategory.unshift({
        id: res.data.category.id,
        name: res.data.category.name,
        ownerCompanyId: res.data.category.ownerCompanyId,
        Maintenances: [],
      });

      setCategories([...tempCategory]);

      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaCreateCategory = yup
  .object({
    categoryName: yup
      .string()
      .required('O nome da categoria deve ser preenchido.')
      .min(3, 'O nome da categoria deve conter 3 ou mais caracteres.'),
  })
  .required();
