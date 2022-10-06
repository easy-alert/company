// LIBS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import { Form, Formik } from 'formik';
import * as Style from './styles';
import { Button } from '../../../../../../components/Buttons/Button';
import { FormikImageInput } from '../../../../../../components/Form/FormikImageInput';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../components/Modal';

// TYPES
import { IModalEditCompanyAndOwner } from './utils/types';

// FUNCTIONS
import { IFormDataCompany } from '../../../../List/utils/types';
import { applyMask } from '../../../../../../utils/functions';
import {
  requestEditCompanyAndOwner,
  schemaModalEditCompanyAndOwnerWithCNPJ,
  schemaModalEditCompanyAndOwnerWithCPF,
} from './utils/functions';

export const ModalEditCompanyAndOwner = ({
  setCompany,
  company,
  setModal,
}: IModalEditCompanyAndOwner) => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Editar usuário" setModal={setModal}>
      <Formik
        initialValues={{
          image: company.image,
          name: company.UserCompanies[0].User.name,
          email: company.UserCompanies[0].User.email,
          companyName: company.name,
          contactNumber: applyMask({
            value: company.contactNumber,
            mask: 'TEL',
          }).value,
          CPF: company.CPF ? applyMask({ value: company.CPF, mask: 'CPF' }).value : '',
          CNPJ: company.CNPJ ? applyMask({ value: company.CNPJ, mask: 'CNPJ' }).value : '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={
          company.CPF
            ? schemaModalEditCompanyAndOwnerWithCPF
            : schemaModalEditCompanyAndOwnerWithCNPJ
        }
        onSubmit={async (data: IFormDataCompany) => {
          await requestEditCompanyAndOwner({
            data,
            company,
            setCompany,
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

              {company.CPF && (
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

              {company.CNPJ && (
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
                type="password"
                label="Senha"
                name="password"
                value={values.password}
                error={touched.password && errors.password ? errors.password : null}
                passwordPlaceholder
                placeholder="••••••••••"
                maxLength={120}
              />
              <FormikInput
                type="password"
                label="Confirmar senha"
                name="confirmPassword"
                value={values.confirmPassword}
                error={
                  touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null
                }
                passwordPlaceholder
                placeholder="••••••••••"
                maxLength={120}
              />
              <Button center label="Cadastrar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
