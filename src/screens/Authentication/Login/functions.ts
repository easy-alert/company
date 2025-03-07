// LIBS
import * as yup from 'yup';

const phoneRegExp = /^\(\d{2}\) \d{5}-\d{4}$/;

export const schema = yup
  .object({
    login: yup
      .string()
      .test('is-email-or-phone', 'Informe um e-mail ou telefone válido.', (value) => {
        const emailValid = yup.string().email().isValidSync(value);
        const phoneValid = yup.string().matches(phoneRegExp).isValidSync(value);
        return emailValid || phoneValid;
      })
      .required('E-mail ou telefone obrigatório.'),

    password: yup.string().required('Informe a senha.'),
  })
  .required();
