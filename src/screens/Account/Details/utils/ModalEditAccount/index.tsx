// LIBS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import { Form, Formik } from 'formik';
import * as Style from './styles';
import { Button } from '../../../../../components/Buttons/Button';
import { FormikImageInput } from '../../../../../components/Form/FormikImageInput';
import { FormikInput } from '../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../components/Modal';

// TYPES
import { IModalEditAccount } from './utils/types';

// FUNCTIONS
import { applyMask } from '../../../../../utils/functions';
import {
  requestEditAccount,
  schemaModalEditAccountWithCNPJ,
  schemaModalEditAccountWithCPF,
} from './utils/functions';
import { IconButton } from '../../../../../components/Buttons/IconButton';
import { icon } from '../../../../../assets/icons';

export const ModalEditAccount = ({ account, setAccount, setModal }: IModalEditAccount) => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);

  return (
    <Modal title="Editar usuário" setModal={setModal}>
      <Formik
        initialValues={{
          image: account.Company.image,
          name: account.User.name,
          email: account.User.email,
          companyName: account.Company.name,
          supportLink: account.Company.supportLink,
          contactNumber: applyMask({
            value: account.Company.contactNumber,
            mask: 'TEL',
          }).value,
          CPF: account.Company.CPF
            ? applyMask({ value: account.Company.CPF, mask: 'CPF' }).value
            : '',
          CNPJ: account.Company.CNPJ
            ? applyMask({ value: account.Company.CNPJ, mask: 'CNPJ' }).value
            : '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={
          account.Company.CPF ? schemaModalEditAccountWithCPF : schemaModalEditAccountWithCNPJ
        }
        onSubmit={async (values) => {
          setShowPassword(false);
          setShowPassword2(false);
          await requestEditAccount({
            values,
            account,
            setAccount,
            navigate,
            setOnQuery,
            setModal,
          });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              <FormikImageInput
                name="image"
                label="Logo"
                error={touched.image && errors.image ? errors.image : null}
                defaultImage={values.image}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(event: any) => {
                  if (event.target.files?.length) {
                    setFieldValue('image', event.target.files[0]);
                  }
                }}
              />
              <FormikInput
                label="Nome do responsável"
                name="name"
                value={values.name}
                error={touched.name && errors.name ? errors.name : null}
                placeholder="Ex: João Silva"
                maxLength={40}
              />
              <FormikInput
                label="E-mail"
                name="email"
                value={values.email}
                error={touched.email && errors.email ? errors.email : null}
                placeholder="Ex: joao.silva@easyalert.com"
                maxLength={40}
              />
              <FormikInput
                label="Nome da empresa"
                name="companyName"
                value={values.companyName}
                error={touched.companyName && errors.companyName ? errors.companyName : null}
                placeholder="Ex: SATC"
                maxLength={40}
              />
              <FormikInput
                label="Telefone"
                name="contactNumber"
                maxLength={
                  applyMask({
                    value: values.contactNumber,
                    mask: 'TEL',
                  }).length
                }
                value={values.contactNumber}
                error={touched.contactNumber && errors.contactNumber ? errors.contactNumber : null}
                placeholder="Ex: (00) 0 0000-0000"
                onChange={(e) => {
                  setFieldValue(
                    'contactNumber',
                    applyMask({ value: e.target.value, mask: 'TEL' }).value,
                  );
                }}
              />

              {account.Company.CPF && (
                <FormikInput
                  name="CPF"
                  label="CPF"
                  maxLength={applyMask({ value: values.CPF, mask: 'CPF' }).length}
                  value={values.CPF}
                  error={touched.CPF && errors.CPF ? errors.CPF : null}
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    setFieldValue('CPF', applyMask({ value: e.target.value, mask: 'CPF' }).value);
                  }}
                />
              )}

              {account.Company.CNPJ && (
                <FormikInput
                  name="CNPJ"
                  label="CNPJ"
                  maxLength={applyMask({ value: values.CNPJ, mask: 'CNPJ' }).length}
                  value={values.CNPJ}
                  error={touched.CNPJ && errors.CNPJ ? errors.CNPJ : null}
                  placeholder="00.000.000/0000-00"
                  onChange={(e) => {
                    setFieldValue('CNPJ', applyMask({ value: e.target.value, mask: 'CNPJ' }).value);
                  }}
                />
              )}

              <FormikInput
                label="Link para chamado"
                name="supportLink"
                value={values.supportLink}
                error={touched.supportLink && errors.supportLink ? errors.supportLink : null}
                placeholder="Ex: https://easyalert.com.br"
              />

              <Style.PasswordDiv>
                <FormikInput
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  name="password"
                  value={values.password}
                  error={touched.password && errors.password ? errors.password : null}
                  passwordPlaceholder
                  placeholder="••••••••••"
                  maxLength={120}
                />
                {values.password && (
                  <IconButton
                    icon={showPassword ? icon.eye : icon.eyeGray}
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
                  type={showPassword2 ? 'text' : 'password'}
                  label="Confirmar senha"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : null
                  }
                  passwordPlaceholder
                  placeholder="••••••••••"
                  maxLength={120}
                />
                {values.confirmPassword && (
                  <IconButton
                    icon={showPassword2 ? icon.eye : icon.eyeGray}
                    size="20px"
                    onClick={() => {
                      setShowPassword2((prevState) => !prevState);
                    }}
                    opacity="1"
                  />
                )}
              </Style.PasswordDiv>

              <Button center label="Salvar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
