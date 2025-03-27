// LIBS
import * as yup from 'yup';

// YUP
export const schemaModalEditAccountWithCNPJ = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .test('FileSize', 'O tamanho da imagem excedeu o limite.', (value) => {
        if (!value) return true;

        if (value instanceof File) {
          return value.size <= 5 * 1024 * 1024; // 5MB
        }

        return true;
      })
      .test('FileType', 'Formato inválido.', (value) => {
        if (!value) return true;

        if (value instanceof File) {
          return ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type);
        }

        return true;
      }),

    companyName: yup
      .string()
      .required('O nome da empresa deve ser preenchido.')
      .min(3, 'O nome da empresa deve conter 3 ou mais caracteres.'),

    contactNumber: yup
      .string()
      .required('O número de telefone deve ser preenchido.')
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),

    CNPJ: yup.string().required('O CNPJ deve ser preenchido.').min(18, 'O CNPJ deve ser válido.'),

    ticketType: yup.string(),
    ticketInfo: yup.string(),
    showMaintenancePriority: yup.boolean(),
  })
  .required();

// YUP
export const schemaModalEditAccountWithCPF = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .test('FileSize', 'O tamanho da imagem excedeu o limite.', (value) => {
        if (!value) return true;

        if (value instanceof File) {
          return value.size <= 5 * 1024 * 1024; // 5MB
        }

        return true;
      })
      .test('FileType', 'Formato inválido.', (value) => {
        if (!value) return true;

        if (value instanceof File) {
          return ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type);
        }

        return true;
      }),

    companyName: yup
      .string()
      .required('O nome da empresa deve ser preenchido.')
      .min(3, 'O nome da empresa deve conter 3 ou mais caracteres.'),

    contactNumber: yup
      .string()
      .required('O número de telefone deve ser preenchido.')
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),

    CPF: yup.string().required('O CPF deve ser preenchido.').min(14, 'O CPF deve ser válido.'),

    ticketType: yup.string(),
    ticketInfo: yup.string(),
    showMaintenancePriority: yup.boolean(),
  })
  .required();
