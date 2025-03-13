// REACT
import { useState } from 'react';
import { toast } from 'react-toastify';

// LIBS
import * as yup from 'yup';
import { Form, Formik } from 'formik';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikImageInput } from '@components/Form/FormikImageInput';

// GLOBAL UTILS
import { applyMask, catchHandler, unMask, uploadFile } from '@utils/functions';

interface IModalCreateUser {
  handleModals: (modal: string, modalState: boolean) => void;
  onThenRequest: () => Promise<void>;
}

const fieldLabels: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  phoneNumber: 'Telefone',
  password: 'Senha',
  confirmPassword: 'Confirmar senha',
};

const schema = yup
  .object({
    image: yup
      .mixed()
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
    password: yup
      .string()
      .required(() => `O ${fieldLabels.password.toLowerCase()} deve ser preenchido.`)
      .matches(/^(|.{8,})$/, 'a senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: yup
      .string()
      .required(() => `O ${fieldLabels.confirmPassword.toLowerCase()} deve ser preenchido.`)
      .oneOf([yup.ref('password'), null], 'as senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup.string().required(() => `confirme a nova senha.`),
      }),
  })
  .required();

interface FormValues {
  image?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  password: string;
  confirmPassword: string;
}

export const ModalCreateUser = ({ handleModals, onThenRequest }: IModalCreateUser) => {
  const [onQuery, setOnQuery] = useState(false);

  async function handleCreteUser(data: FormValues) {
    setOnQuery(true);

    await Api.post('/usercompany/create-user', data)
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        handleModals('createUser', false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  }

  return (
    <Modal setModal={(state) => handleModals('createUser', state)} title="Cadastrar usuário">
      <Formik
        initialValues={{
          image: null,
          name: '',
          email: '',
          phoneNumber: '',
          role: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          setOnQuery(true);

          let imageUrl: string | null = null;

          if (values.image && typeof values.image === 'object') {
            const { Location } = await uploadFile(values.image);
            imageUrl = Location;
          } else {
            imageUrl = values.image || '';
          }

          const data = {
            ...values,
            image: imageUrl,
            phoneNumber: unMask(values.phoneNumber),
          };

          await handleCreteUser(data);
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Form>
            <FormikImageInput
              name="image"
              label="Foto"
              error={touched.image && errors.image ? errors.image : null}
              defaultImage={values.image}
              onChange={(event: any) => {
                if (event.target.files?.length) {
                  setFieldValue('image', event.target.files[0]);
                }
              }}
            />

            <FormikInput
              name="name"
              label="Nome *"
              placeholder="Informe o nome"
              value={values.name}
              error={touched.name && errors.name ? errors.name : null}
            />

            <FormikInput
              name="role"
              label="Cargo"
              placeholder="Informe o cargo"
              value={values.role}
              error={touched.role && errors.role ? errors.role : null}
            />

            <FormikInput
              name="email"
              label="E-mail *"
              placeholder="Informe o email"
              value={values.email}
              error={touched.email && errors.email ? errors.email : null}
            />

            <FormikInput
              name="phoneNumber"
              label="Telefone"
              placeholder="Informe o telefone"
              value={values.phoneNumber}
              error={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : null}
              maxLength={applyMask({ value: values.phoneNumber, mask: 'TEL' }).length}
              onChange={(e) => {
                setFieldValue(
                  'phoneNumber',
                  applyMask({ value: e.target.value, mask: 'TEL' }).value,
                );
              }}
            />

            <FormikInput
              name="password"
              label="Senha *"
              placeholder="Informe a nova senha"
              type="password"
              value={values.password}
              error={touched.password && errors.password ? errors.password : null}
            />

            <FormikInput
              name="confirmPassword"
              label="Confirmar senha *"
              placeholder="Confirme a nova senha"
              type="password"
              value={values.confirmPassword}
              error={
                touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null
              }
            />

            <Button
              bgColor="primary"
              type="submit"
              label="Cadastrar"
              loading={onQuery}
              center
              style={{ marginTop: '8px' }}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
