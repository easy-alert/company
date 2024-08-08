import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/Buttons/Button';
import { Modal } from '../../../../components/Modal';
import { catchHandler } from '../../../../utils/functions';
import { Api } from '../../../../services/api';
import { FormInput } from '../../../../components/HookFormInputs/Input';
import { FormSelect } from '../../../../components/HookFormInputs/Select';
import { ISelectedUser } from '..';

interface IModalUpdateUser {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: ISelectedUser;
  onThenRequest: () => Promise<void>;
}

export const ModalUpdateUser = ({ setModal, selectedUser, onThenRequest }: IModalUpdateUser) => {
  const [onQuery, setOnQuery] = useState(false);

  const schema = yup
    .object({
      name: yup.string().required('Campo obrigatório.'),
      status: yup.string().required('Campo obrigatório.'),
      email: yup.string().required('Campo obrigatório.').email('Informe um email válido.'),

      password: yup.string().matches(/^(|.{8,})$/, 'A senha deve ter pelo menos 8 caracteres.'),

      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
        .when('password', {
          is: (password: string) => password && password.length > 0,
          then: yup.string().required('Confirme a nova senha.'),
        }),
    })
    .required();

  type TFormData = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: yupResolver(schema),
    defaultValues: selectedUser,
  });

  async function updateUser(data: TFormData) {
    setOnQuery(true);

    await Api.put('/usercompany/update', {
      ...data,
      isBlocked: data.status === 'blocked',
    })
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
    <Modal setModal={setModal} title="Editar usuário">
      <form onSubmit={handleSubmit(updateUser)}>
        <FormInput
          placeholder="Informe o nome"
          {...register('name')}
          label="Nome"
          error={errors.name?.message}
        />
        <FormInput
          placeholder="Informe o email"
          {...register('email')}
          label="Email"
          error={errors.email?.message}
        />

        <FormSelect {...register('status')} label="Status">
          <option value="active">Ativo</option>
          <option value="blocked">Bloqueado</option>
        </FormSelect>

        <FormInput
          autoComplete="new-password"
          placeholder="Informe a nova senha"
          type="password"
          {...register('password')}
          label="Senha"
          error={errors.password?.message}
        />
        <FormInput
          autoComplete="new-password"
          placeholder="Confirme a nova senha"
          type="password"
          {...register('confirmPassword')}
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          loading={onQuery}
          label="Salvar"
          center
          style={{ marginTop: '8px' }}
        />
      </form>
    </Modal>
  );
};
