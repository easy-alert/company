/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Api } from '../../../../services/api';
import { uploadFile, unMask, catchHandler } from '../../../../utils/functions';
import { IAccount } from '../../../../utils/types';
import { IRequestEditAccount } from './types';

export const requestEditAccount = async ({
  values,
  setModal,
  account,
  setAccount,
  navigate,
  setOnQuery,
}: IRequestEditAccount) => {
  let imageUrl: any;
  setOnQuery(true);

  if (!values.image.length) {
    const { Location } = await uploadFile(values.image);
    imageUrl = Location;
  } else {
    imageUrl = account.Company.image;
  }

  if (
    values.supportLink &&
    !values.supportLink.startsWith('www.') &&
    !values.supportLink.startsWith('https://') &&
    !values.supportLink.startsWith('http://') &&
    !values.supportLink.startsWith('//')
  ) {
    toast.error(
      <div>
        Informe um link válido.
        <br />
        Ex: www.easyalert.com.br
      </div>,
    );
    return;
  }

  const formattedSupportLink =
    values.supportLink &&
    (values.supportLink.startsWith('https://') ||
      values.supportLink.startsWith('http://') ||
      values.supportLink.startsWith('//'))
      ? values.supportLink
      : `//${values.supportLink}`;

  await Api.put('/account/edit', {
    name: values.name,
    email: values.email,
    password: values.password !== '' ? values.password : null,
    image: imageUrl,
    supportLink: formattedSupportLink === '//' ? null : formattedSupportLink,
    companyName: values.companyName,
    CNPJ: values.CNPJ !== '' ? unMask(values.CNPJ) : null,
    CPF: values.CPF !== '' ? unMask(values.CPF) : null,
    contactNumber: unMask(values.contactNumber),
  })
    .then((res) => {
      const updatedAccount: IAccount = {
        origin: 'Company',
        Company: {
          contactNumber: values.contactNumber,
          image: imageUrl,
          name: values.companyName,
          CNPJ: values.CNPJ,
          supportLink: values.supportLink ? values.supportLink : null,
          CPF: values.CPF,
          createdAt: account.Company.createdAt,
          id: account.Company.id,
          UserCompanies: account.Company.UserCompanies,
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
export const schemaModalEditAccountWithCNPJ = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test(
        'FileSize',
        'O tamanho da imagem excedeu o limite.',
        (value) => value.length || (value && value.size <= 5000000),
      )
      .test(
        'FileType',
        'Formato inválido.',
        (value) =>
          value.length ||
          (value &&
            (value.type === 'image/png' ||
              value.type === 'image/jpeg' ||
              value.type === 'image/jpg')),
      ),

    name: yup
      .string()
      .required('O nome deve ser preenchido.')
      .min(3, 'O nome deve conter 3 ou mais caracteres.'),

    email: yup
      .string()
      .email('Informe um e-mail válido.')
      .required('O e-mail deve ser preenchido.'),

    companyName: yup
      .string()
      .required('O nome da empresa deve ser preenchido.')
      .min(3, 'O nome da empresa deve conter 3 ou mais caracteres.'),

    contactNumber: yup
      .string()
      .required('O número de telefone deve ser preenchido.')
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),

    CNPJ: yup.string().required('O CNPJ deve ser preenchido.').min(18, 'O CNPJ deve ser válido.'),

    supportLink: yup.string().nullable(),

    password: yup.string().matches(/^(|.{8,})$/, 'A senha deve ter pelo menos 8 caracteres.'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup.string().required('Confirme a nova senha.'),
      }),
  })
  .required();

// YUP
export const schemaModalEditAccountWithCPF = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test(
        'FileSize',
        'O tamanho da imagem excedeu o limite.',
        (value) => value.length || (value && value.size <= 5000000),
      )
      .test(
        'FileType',
        'Formato inválido.',
        (value) =>
          value.length ||
          (value &&
            (value.type === 'image/png' ||
              value.type === 'image/jpeg' ||
              value.type === 'image/jpg')),
      ),

    name: yup
      .string()
      .required('O nome deve ser preenchido.')
      .min(3, 'O nome deve conter 3 ou mais caracteres.'),

    email: yup
      .string()
      .email('Informe um e-mail válido.')
      .required('O e-mail deve ser preenchido.'),

    companyName: yup
      .string()
      .required('O nome da empresa deve ser preenchido.')
      .min(3, 'O nome da empresa deve conter 3 ou mais caracteres.'),

    contactNumber: yup
      .string()
      .required('O número de telefone deve ser preenchido.')
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),

    CPF: yup.string().required('O CPF deve ser preenchido.').min(14, 'O CPF deve ser válido.'),

    supportLink: yup.string().nullable(),

    password: yup.string().matches(/^(|.{8,})$/, 'A senha deve ter pelo menos 8 caracteres.'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup.string().required('Confirme a nova senha.'),
      }),
  })
  .required();
