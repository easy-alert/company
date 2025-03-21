// REACT
import { useState } from 'react';
import { ChromePicker } from 'react-color';

// LIBS
import { Form, Formik } from 'formik';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { useCustomTheme } from '@contexts/ThemeContext';

// SERVICES
import { updateUser } from '@services/apis/updateUser';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { InputRadio } from '@components/Inputs/InputRadio';
import { IconButton } from '@components/Buttons/IconButton';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikImageInput } from '@components/Form/FormikImageInput';
import { FormikSelect } from '@components/Form/FormikSelect';

// GLOBAL UTILS
import { applyMask, uploadFile } from '@utils/functions';

// GLOBAL ASSETS
import IconEye from '@assets/icons/IconEye';

// GLOBAL TYPES
import type { IAccount } from '@utils/types';

// UTILS
import { userUpdateSchema } from './schema';

// STYLES
import * as Style from './styles';

// TYPES
import type { ISelectedUser } from '..';

export interface UpdateUserValues {
  id?: string;
  image?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  password: string;
  confirmPassword: string;
  isBlocked: boolean;
  colorScheme: string;
}

interface IModalUpdateUser {
  selectedUser: ISelectedUser;
  handleModals: (modal: string, modalState: boolean) => void;
}

export const ModalUpdateUser = ({ selectedUser, handleModals }: IModalUpdateUser) => {
  const { handleChangeUser } = useAuthContext();
  const { updateThemeColor } = useCustomTheme();

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);

  const [onQuery, setOnQuery] = useState(false);

  const handleEditUser = async (values: UpdateUserValues) => {
    setOnQuery(true);

    try {
      let imageUrl: string | null = null;

      if (values.image && typeof values.image === 'object') {
        const { Location } = await uploadFile(values.image);
        imageUrl = Location;
      } else {
        imageUrl = values.image || '';
      }

      const data = {
        ...values,
        id: selectedUser.id,
        image: imageUrl,
      };

      const updatedUser = await updateUser({
        data,
      });

      if (!updatedUser) return;

      handleChangeUser(updatedUser as IAccount['User']);
      updateThemeColor(updatedUser.colorScheme);
      handleModals('updateUser', false);
    } finally {
      setOnQuery(false);
    }
  };

  return (
    <Modal title="Editar usuário" setModal={() => handleModals('updateUser', false)}>
      <Formik
        initialValues={{
          image: selectedUser.image || '',
          name: selectedUser.name,
          role: selectedUser.role || '',
          email: selectedUser.email,
          phoneNumber: applyMask({ value: selectedUser.phoneNumber, mask: 'TEL' }).value,
          isBlocked: selectedUser.isBlocked,
          password: '',
          confirmPassword: '',
          colorScheme: selectedUser.colorScheme || '#B21D1D',
        }}
        validationSchema={userUpdateSchema}
        onSubmit={async (values) => handleEditUser(values)}
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

            <FormikSelect
              name="isBlocked"
              label="Status *"
              arrowColor="primary"
              placeholder="Selecione o status"
              selectPlaceholderValue="Selecione o status"
              value={values.isBlocked ? 'blocked' : 'active'}
              error={touched.isBlocked && errors.isBlocked ? errors.isBlocked : null}
              onChange={(e) => {
                setFieldValue('isBlocked', e.target.value === 'blocked');
              }}
            >
              <option value="active">Ativo</option>
              <option value="blocked">Bloqueado</option>
            </FormikSelect>

            <Style.PasswordDiv>
              <FormikInput
                name="password"
                label="Senha"
                placeholder="Informe a nova senha"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                error={touched.password && errors.password ? errors.password : null}
              />

              {values.password && (
                <IconButton
                  icon={<IconEye strokeColor={showPassword ? 'primary' : 'gray4'} />}
                  size="20px"
                  onClick={() => {
                    setShowPassword((prevState) => !prevState);
                  }}
                  opacity="1"
                />
              )}
            </Style.PasswordDiv>

            <Style.PasswordDiv>
              <FormikInput
                name="confirmPassword"
                label="Confirmar senha"
                placeholder="Confirme a nova senha"
                type={showPassword2 ? 'text' : 'password'}
                value={values.confirmPassword}
                error={
                  touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null
                }
              />

              {values.confirmPassword && (
                <IconButton
                  icon={<IconEye strokeColor={showPassword2 ? 'primary' : 'gray4'} />}
                  size="20px"
                  onClick={() => {
                    setShowPassword2((prevState) => !prevState);
                  }}
                  opacity="1"
                />
              )}
            </Style.PasswordDiv>

            <InputRadio
              id="color-picker"
              name="color-picker"
              label="Deseja alterar a cor da sua conta?"
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <Style.ColorPickerContainer>
                <ChromePicker
                  color={values.colorScheme}
                  disableAlpha
                  onChange={(color) => setFieldValue('colorScheme', color.hex)}
                />

                <div>
                  <Style.SelectedColorBox selectedColor={values.colorScheme} />
                  <Button
                    bgColor="primary"
                    type="button"
                    onClick={() => {
                      setFieldValue('colorScheme', '#B21D1D');
                    }}
                    label="Restaurar tema"
                    center
                    style={{ marginTop: '8px', display: 'block' }}
                  />
                </div>
              </Style.ColorPickerContainer>
            )}

            <Button
              bgColor="primary"
              type="submit"
              label="Atualizar"
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
