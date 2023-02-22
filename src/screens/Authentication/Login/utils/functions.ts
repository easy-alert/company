// LIBS
import * as yup from 'yup';

export const schema = yup
  .object({
    email: yup.string().email('Informe um e-mail válido.').required('E-mail obrigatório.'),

    password: yup.string().required('Informe a senha.'),
  })
  .required();
