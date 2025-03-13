import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Modal } from '../../../../../../components/Modal';
import * as Style from './styles';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Button } from '../../../../../../components/Buttons/Button';
import { Api } from '../../../../../../services/api';
import { applyMask, catchHandler } from '../../../../../../utils/functions';

interface IModalChangeClientPassword {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'resident' | 'responsible';
  onThen: () => Promise<void>;
}

const schema = yup
  .object({
    password: yup.string().matches(/^[0-9]{4}$/, 'A senha deve conter 4 caracteres numéricos.'),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
      .when('password', {
        is: (password: string) => password && password.length > 0,
        then: yup.string().required('Confirme a senha.'),
      }),
  })
  .required();

export const ModalChangeClientPassword = ({
  setModal,
  type,
  onThen,
}: IModalChangeClientPassword) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const { buildingId } = useParams() as { buildingId: string };

  const label = {
    responsible: 'Responsável',
    resident: 'Morador',
  };

  return (
    <Modal setModal={setModal} title={`Editar senha - ${label[type]}`}>
      <Formik
        validationSchema={schema}
        initialValues={{
          password: '',
          confirmPassword: '',
          buildingId,
          type,
        }}
        onSubmit={async (values) => {
          setOnQuery(true);

          await Api.put('/buildings/client-passwords', {
            ...values,
            password: values.password || null,
            confirmPassword: values.confirmPassword || null,
          })
            .then((res) => {
              onThen();
              setModal(false);
              toast.success(res.data.ServerMessage.message);
            })
            .catch((err) => {
              setOnQuery(false);
              catchHandler(err);
            });
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <FormikInput
              passwordShowToggle
              autoComplete="off"
              type="password"
              name="password"
              label="Senha"
              placeholder="EX: 0000"
              maxLength={4}
              error={touched.password && errors.password ? errors.password : null}
              onChange={(evt) => {
                setFieldValue(
                  'password',
                  applyMask({ mask: 'NUM', value: evt.target.value }).value,
                );
              }}
            />
            <Style.Message>
              <p className="p2">1 - São aceitos somente 4 dígitos</p>
              <p className="p2">2 - Escolha apenas números</p>
              <p className="p2">3 - Salve em branco para remover</p>
            </Style.Message>
            <FormikInput
              passwordShowToggle
              autoComplete="off"
              type="password"
              name="confirmPassword"
              label="Confirmar senha"
              placeholder="EX: 0000"
              maxLength={4}
              error={
                touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null
              }
              onChange={(evt) => {
                setFieldValue(
                  'confirmPassword',
                  applyMask({ mask: 'NUM', value: evt.target.value }).value,
                );
              }}
            />

            <Button
              bgColor="primary"
              type="submit"
              label="Salvar"
              center
              style={{ marginTop: '8px' }}
              loading={onQuery}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
