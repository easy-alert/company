// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../../../../services/api';
import { catchHandler } from '../../../../../../../../../utils/functions';

// TYPES
import { IDeleteCategory, IEditCategory } from './types';

export const requestEditCategory = async ({
  categoryId,
  values,
  setCategories,
  categories,
  setModal,
  setOnQuery,
}: IEditCategory) => {
  setOnQuery(true);
  await Api.put('/categories/edit', {
    categoryId,
    name: values.categoryName,
  })
    .then((res) => {
      toast.dismiss();

      const categoriesEdit = categories;
      const index = categories.findIndex((category) => category.id === categoryId);
      categoriesEdit[index] = {
        id: categoryId,
        name: values.categoryName,
        Maintenances: categoriesEdit[index].Maintenances,
      };

      setCategories([...categoriesEdit]);

      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

export const requestDeleteCategory = async ({
  categoryId,
  categories,
  setCategories,
  setOnQuery,
}: IDeleteCategory) => {
  setOnQuery(true);
  await Api.delete('/categories/delete', {
    data: {
      categoryId,
    },
  })
    .then((res) => {
      toast.dismiss();

      const categoriesEdit = categories;
      const index = categories.findIndex((category) => category.id === categoryId);
      categoriesEdit.splice(index, 1);
      setCategories([...categoriesEdit]);

      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaEditCategory = yup
  .object({
    categoryName: yup
      .string()
      .required('Nome da categoria é obrigatório.')
      .min(3, 'O nome da categoria deve conter 3 ou mais caracteres.'),
  })
  .required();
