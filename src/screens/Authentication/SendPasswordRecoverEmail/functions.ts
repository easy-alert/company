// LIBS
import * as yup from 'yup';

export const sendPasswordRecoverEmailSchema = yup
  .object({
    email: yup.string().email('Informe um e-mail válido.').required('E-mail obrigatório.'),
  })
  .required();
