/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../services/api';
import { catchHandler, unMask, uploadFile } from '../../../../../../utils/functions';

// TYPES
import { IAccount } from '../../../../../../utils/types';
import { IRequestEditAccount } from './types';

export const requestEditAccount = async ({
  values,
  setModal,
  account,
  setAccount,
  navigate,
  setOnQuery,
}: IRequestEditAccount) => {
  setOnQuery(true);
  let imageUrl: any;

  if (!values.image.length) {
    const { Location } = await uploadFile(values.image);
    imageUrl = Location;
  } else {
    imageUrl = account.Company.image;
  }

  await Api.put('/account/edit', {
    name: values.name,
    email: values.email,
    password: values.password !== '' ? values.password : null,
    image: imageUrl,
    companyName: values.companyName,
    CNPJ: values.CNPJ !== '' ? unMask(values.CNPJ) : null,
    CPF: values.CPF !== '' ? unMask(values.CPF) : null,
    contactNumber: unMask(values.contactNumber),
  })
    .then((res) => {
      const updatedAccount: IAccount = {
        Company: {
          contactNumber: values.contactNumber,
          image: imageUrl,
          name: values.companyName,
          CNPJ: values.CNPJ,
          CPF: values.CPF,
          createdAt: account.Company.createdAt,
          id: account.Company.id,
        },
        User: {
          createdAt: account.User.createdAt,
          email: values.email,
          id: account.User.id,
          lastAccess: account.User.lastAccess,
          name: values.name,
          Permissions: account.User.Permissions,
        },
      };

      setAccount(updatedAccount);
      navigate(window.location.pathname, { state: updatedAccount });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalCreateBuilding = yup
  .object({
    name: yup.string().required('O nome deve ser preenchido.'),
    type: yup.string().required('O tipo deve ser selecionado.'),
    cep: yup.string(),
    city: yup.string(),
    state: yup.string(),
    neighborhood: yup.string(),
    streetName: yup.string(),
    area: yup.string(),
    deliveryDate: yup.date().required('A data de entrega deve ser preenchido.'),
    warrantyExpiration: yup.date().required('O término da garantia deve ser preenchido.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
  })
  .required();
