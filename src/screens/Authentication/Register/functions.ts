// LIBS
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '@services/api';
import { catchHandler, unMask, uploadFile } from '@utils/functions';

// TYPES
import { IRequestCreateCompanyAndOWner } from './types';

export const requestCreateCompanyAndOWner = async ({
  values,
  setOnQuery,
  navigate,
  signin,
}: IRequestCreateCompanyAndOWner) => {
  setOnQuery(true);
  let imageUrl;

  if (values.image) {
    const { Location } = await uploadFile(values.image as unknown as File);
    imageUrl = Location;
  } else {
    imageUrl = `https://api.dicebear.com/7.x/initials/png?seed=${encodeURI(values.companyName)}`;
  }

  await Api.post('/usercompany/create', {
    image: imageUrl,
    name: values.name,
    email: values.email,
    password: values.password,
    companyName: values.companyName,
    CNPJ: values.CNPJorCPF?.length === 18 ? unMask(values.CNPJorCPF) : null,
    CPF: values.CNPJorCPF?.length === 14 ? unMask(values.CNPJorCPF) : null,
    contactNumber: unMask(values.contactNumber),
  })
    .then((res) => {
      signin(res.data);
      navigate('/home');
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalCreateCompanyAndOwner = yup
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

    CNPJorCPF: yup
      .string()
      .required('Um CNPJ ou um CPF deve ser informado.')
      .test(
        'len',
        'Informe um CNPJ ou um CPF válido.',
        (val) => val?.length === 14 || val?.length === 18,
      ),

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
