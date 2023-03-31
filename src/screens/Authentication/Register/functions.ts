// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../services/api';
import { catchHandler, unMask, uploadFile } from '../../../utils/functions';

// TYPES
import { IRequestCreateCompanyAndOWner } from './types';

export const requestCreateCompanyAndOWner = async ({
  values,
  setOnQuery,
}: IRequestCreateCompanyAndOWner) => {
  setOnQuery(true);
  let imageUrl;

  if (values.image) {
    const { Location } = await uploadFile(values.image);
    imageUrl = Location;
  } else {
    imageUrl = `https://avatars.dicebear.com/api/initials/${values.companyName.replace(
      /\s/g,
      '%20',
    )}.png`;
  }

  await Api.post('/usercompany/create', {
    image: imageUrl,
    name: values.name,
    email: values.email,
    password: values.password,
    companyName: values.companyName,
    CNPJ: values.CNPJ !== '' ? unMask(values.CNPJ) : null,
    CPF: values.CPF !== '' ? unMask(values.CPF) : null,
    contactNumber: unMask(values.contactNumber),
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalCreateCompanyAndOwnerWithCNPJ = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test(
        'FileSize',
        'O tamanho da imagem excedeu o limite.',
        (value) => !value || (value && value.size <= 5000000),
      )
      .test(
        'FileType',
        'Formato inválido.',
        (value) =>
          !value ||
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

    password: yup
      .string()
      .required('Informe a senha.')
      .min(8, 'Sua senha deve possuir 8 ou mais caracteres.'),

    confirmPassword: yup
      .string()
      .required('Informe a senha.')
      .min(8, 'Sua senha deve possuir 8 ou mais caracteres.')
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.'),
  })
  .required();

// YUP
export const schemaModalCreateCompanyAndOwnerWithCPF = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test(
        'FileSize',
        'O tamanho da imagem excedeu o limite.',
        (value) => !value || (value && value.size <= 5000000),
      )
      .test(
        'FileType',
        'Formato inválido.',
        (value) =>
          !value ||
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

    password: yup
      .string()
      .required('Informe a senha.')
      .min(8, 'Sua senha deve possuir 8 ou mais caracteres.'),

    confirmPassword: yup
      .string()
      .required('Informe a senha.')
      .min(8, 'Sua senha deve possuir 8 ou mais caracteres.')
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.'),
  })
  .required();
