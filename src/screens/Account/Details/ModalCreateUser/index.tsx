import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { catchHandler } from '@utils/functions';
import { Api } from '@services/api';
import { FormInput } from '@components/HookFormInputs/Input';

interface IModalCreateUser {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
}

const fieldLabels: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  password: 'Senha',
  confirmPassword: 'Confirmar senha',
};

const schema = yup
  .object({
    name: yup.string().required(() => `O ${fieldLabels.name.toLowerCase()} deve ser preenchido.`),
    email: yup
      .string()
      .required(() => `O ${fieldLabels.email.toLowerCase()} deve ser preenchido.`)
      .email('informe um email válido.'),
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

type TFormData = yup.InferType<typeof schema>;

export const ModalCreateUser = ({ setModal, onThenRequest }: IModalCreateUser) => {
  const [onQuery, setOnQuery] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: yupResolver(schema),
  });

  async function updateUser(data: TFormData) {
    setOnQuery(true);

    await Api.post('/usercompany/create-user', data)
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        setModal(false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  }

  return (
    <Modal setModal={setModal} title="Cadastrar usuário">
      <form onSubmit={handleSubmit(updateUser)}>
        <FormInput
          placeholder="Informe o nome"
          {...register('name')}
          label="Nome *"
          error={errors.name?.message}
        />
        <FormInput
          placeholder="Informe o email"
          {...register('email')}
          label="E-mail *"
          error={errors.email?.message}
        />
        <FormInput
          autoComplete="new-password"
          placeholder="Informe a nova senha"
          type="password"
          {...register('password')}
          label="Senha *"
          error={errors.password?.message}
        />
        <FormInput
          autoComplete="new-password"
          placeholder="Confirme a nova senha"
          type="password"
          {...register('confirmPassword')}
          label="Confirmar senha *"
          error={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          loading={onQuery}
          label="Cadastrar"
          center
          style={{ marginTop: '8px' }}
        />
      </form>
    </Modal>
  );
};
