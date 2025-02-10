// LIBS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import { Form, Formik } from 'formik';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';
import { icon } from '@assets/icons';
import { TTranslateTicketType } from '@utils/types';
import { applyMask, translateTicketType } from '@utils/functions';
import { Modal } from '@components/Modal';
import { FormikImageInput } from '@components/Form/FormikImageInput';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikSelect } from '@components/Form/FormikSelect';
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';

// TYPES
import { IModalEditAccount } from './types';

import * as Style from './styles';

// FUNCTIONS
import {
  requestEditAccount,
  schemaModalEditAccountWithCNPJ,
  schemaModalEditAccountWithCPF,
} from './functions';

export const ModalEditAccount = ({ account, setAccount, setModal }: IModalEditAccount) => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);

  const ticketTypes = [
    'none',
    'whatsapp',
    'email',
    'link',
    'platform',
  ].sort() as TTranslateTicketType[];

  const displayExtraTicketField = ['whatsapp', 'email', 'link'].sort() as TTranslateTicketType[];

  return (
    <Modal title="Editar usuário" setModal={setModal}>
      <Formik
        initialValues={{
          image: account.Company.image,
          name: account.User.name,
          email: account.User.email,
          companyName: account.Company.name,
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
          ticketType: account.Company.ticketType,
          ticketInfo: account.Company.ticketInfo || '',
          showMaintenancePriority: account.Company.showMaintenancePriority || false,
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
              />

              <FormikInput
                label="E-mail"
                name="email"
                value={values.email}
                error={touched.email && errors.email ? errors.email : null}
                placeholder="Ex: joao.silva@easyalert.com"
              />

              <FormikInput
                label="Nome da empresa"
                name="companyName"
                value={values.companyName}
                error={touched.companyName && errors.companyName ? errors.companyName : null}
                placeholder="Ex: Easy Alert"
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

              <FormikSelect
                label="Abertura de chamados"
                name="ticketType"
                error={touched.ticketType && errors.ticketType ? errors.ticketType : null}
                selectPlaceholderValue={values.ticketType}
                onChange={(evt) => {
                  setFieldValue('ticketType', evt.target.value);
                  setFieldValue('ticketInfo', '');
                }}
              >
                {ticketTypes.map((data) => (
                  <option key={data} value={data}>
                    {translateTicketType(data)}
                  </option>
                ))}
              </FormikSelect>

              {displayExtraTicketField.includes(values.ticketType) && (
                <FormikInput
                  label={`${translateTicketType(values.ticketType)} para chamado`}
                  name="ticketInfo"
                  maxLength={values.ticketType === 'whatsapp' ? 15 : 500}
                  error={touched.ticketInfo && errors.ticketInfo ? errors.ticketInfo : null}
                  placeholder={`Informe o ${translateTicketType(values.ticketType).toLowerCase()}`}
                  onChange={(e) => {
                    if (values.ticketType === 'whatsapp') {
                      setFieldValue(
                        'ticketInfo',
                        applyMask({ value: e.target.value, mask: 'TEL' }).value,
                      );
                    } else {
                      setFieldValue('ticketInfo', e.target.value);
                    }
                  }}
                />
              )}

              <Style.PasswordDiv>
                <FormikInput
                  autoComplete="one-time-code"
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  name="password"
                  value={values.password}
                  error={touched.password && errors.password ? errors.password : null}
                  placeholder="Informe a nova senha"
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
                  autoComplete="one-time-code"
                  type={showPassword2 ? 'text' : 'password'}
                  label="Confirmar senha"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : null
                  }
                  placeholder="Confirme a nova senha"
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

              <FormikCheckbox
                name="showMaintenancePriority"
                label="Mostrar prioridade de manutenção"
                checked={values.showMaintenancePriority}
                onChange={() =>
                  setFieldValue('showMaintenancePriority', !values.showMaintenancePriority)
                }
              />

              <Button center label="Salvar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
