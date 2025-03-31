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

// GLOBAL UTILS
import { applyMask, catchHandler, unMask } from '@utils/functions';

const phoneRegExp = /^\(\d{2}\) \d{5}-\d{4}$/;

export const schema = yup
  .object({
    userInfo: yup
      .string()
      .test('is-email-or-phone', 'Informe um e-mail ou telefone válido.', (value) => {
        const emailValid = yup.string().email().isValidSync(value);
        const phoneValid = yup.string().matches(phoneRegExp).isValidSync(value);
        return emailValid || phoneValid;
      })
      .required('E-mail ou telefone obrigatório.'),
  })
  .required();

interface FormValues {
  userInfo: string;
}

interface IModalCreateUser {
  handleModals: (modal: string, modalState: boolean) => void;
  onThenRequest: () => Promise<void>;
}

export const ModalLinkUser = ({ handleModals, onThenRequest }: IModalCreateUser) => {
  const [onQuery, setOnQuery] = useState(false);

  async function handleLinkUser(data: FormValues) {
    setOnQuery(true);

    await Api.post('/usercompany/link-user', data)
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        handleModals('linkUser', false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  }

  return (
    <Modal setModal={(state) => handleModals('linkUser', state)} title="Cadastrar usuário">
      <Formik
        initialValues={{
          userInfo: '',
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          setOnQuery(true);

          let formattedLogin = values.userInfo;

          if (formattedLogin.match(/^\(\d{2}\) \d{5}-\d{4}$/)) {
            formattedLogin = unMask(values.userInfo);
          }

          const data = {
            userInfo: formattedLogin,
          };

          await handleLinkUser(data);
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Form>
            <FormikInput
              name="userInfo"
              label="E-mail/Telefone"
              placeholder="Insira seu e-mail ou telefone"
              maxLength={values.userInfo.match(/^\(\d{2}\) \d{5}-\d{4}$/) ? 11 : 100}
              value={values.userInfo}
              onChange={(e) => {
                const { value } = e.target;

                if (/^\d/.test(value) || (value.length > 1 && /^\(\d{1}/.test(value))) {
                  setFieldValue('userInfo', applyMask({ value, mask: 'TEL' }).value);
                } else {
                  setFieldValue('userInfo', value);
                }
              }}
              error={touched.userInfo && errors.userInfo ? errors.userInfo : null}
            />

            <Button
              bgColor="primary"
              type="submit"
              label="Vincular"
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
