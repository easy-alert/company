// LIBS
import * as yup from 'yup';

const fieldLabels: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  phoneNumber: 'Telefone',
  password: 'Senha',
  confirmPassword: 'Confirmar senha',
};

export const userUpdateSchema = yup
  .object({
    image: yup
      .mixed()
      .nullable()
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
    name: yup.string().required(() => `O ${fieldLabels.name.toLowerCase()} deve ser preenchido.`),
    role: yup.string(),
    email: yup
      .string()
      .required(() => `O ${fieldLabels.email.toLowerCase()} deve ser preenchido.`)
      .email('informe um email válido.'),
    phoneNumber: yup
      .string()
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.')
      .required(`O ${fieldLabels.phoneNumber.toLowerCase()} deve ser preenchido.`),
    password: yup.string().matches(/^(|.{8,})$/, 'a senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'as senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup
          .string()
          .required(() => `O ${fieldLabels.confirmPassword.toLowerCase()} deve ser preenchido.`),
      }),
  })
  .required();
