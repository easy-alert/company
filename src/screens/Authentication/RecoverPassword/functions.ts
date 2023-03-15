// LIBS
import * as yup from 'yup';

export const changePasswordSchema = yup
  .object({
    password: yup
      .string()
      .required(`Informe a senha`)
      .min(8, 'A senha deve ter pelo menos 8 caracteres.'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup.string().required('Confirme a nova senha.'),
      }),
  })
  .required();
