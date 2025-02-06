/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Api } from '@services/api';
import { uploadFile, unMask, catchHandler } from '@utils/functions';
import { IAccount } from '@utils/types';
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

  let ticketLink;

  if (values.ticketType === 'link') {
    if (
      values.ticketInfo &&
      !values.ticketInfo.startsWith('www.') &&
      !values.ticketInfo.startsWith('https://') &&
      !values.ticketInfo.startsWith('http://') &&
      !values.ticketInfo.startsWith('//')
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

    // eslint-disable-next-line no-nested-ternary
    ticketLink = values.ticketInfo
      ? values.ticketInfo.startsWith('https://') || values.ticketInfo.startsWith('http://')
        ? values.ticketInfo
        : `https://${values.ticketInfo}`
      : '';
  }

  setOnQuery(true);

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
    ticketInfo: ticketLink || values.ticketInfo,
    ticketType: values.ticketType,
    showMaintenancePriority: values.showMaintenancePriority,
  })
    .then((res) => {
      const updatedAccount: IAccount = {
        origin: 'Company',
        Company: {
          contactNumber: values.contactNumber,
          image: imageUrl,
          name: values.companyName,
          CNPJ: values.CNPJ,
          CPF: values.CPF,
          createdAt: account.Company.createdAt,
          id: account.Company.id,
          UserCompanies: account.Company.UserCompanies,
          ticketInfo: values.ticketInfo,
          ticketType: values.ticketType,
          showMaintenancePriority: values.showMaintenancePriority,
        },
        User: {
          createdAt: account.User.createdAt,
          email: values.email,
          id: account.User.id,
          lastAccess: account.User.lastAccess,
          name: values.name,
          Permissions: account.User.Permissions,
          isCompanyOwner: account.User.isCompanyOwner,
          BuildingsPermissions: account.User.BuildingsPermissions,
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

    password: yup.string().matches(/^(|.{8,})$/, 'A senha deve ter pelo menos 8 caracteres.'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup.string().required('Confirme a nova senha.'),
      }),

    ticketType: yup.string(),

    ticketInfo: yup.string(),
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
