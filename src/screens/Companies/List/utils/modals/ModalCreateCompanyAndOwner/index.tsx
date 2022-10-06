// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '../../../../../../components/Buttons/Button';
import { FormikImageInput } from '../../../../../../components/Form/FormikImageInput';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Switch } from '../../../../../../components/Buttons/SwitchButton';
import { Modal } from '../../../../../../components/Modal';
import * as Style from './styles';

// TYPES
import { IFormDataCompany } from '../../types';
import { IModalCreateCompanyAndOwner } from './utils/types';

// FUNCTIONS

import { applyMask } from '../../../../../../utils/functions';
import {
  requestCreateCompanyAndOWner,
  schemaModalCreateCompanyAndOwnerWithCNPJ,
  schemaModalCreateCompanyAndOwnerWithCPF,
} from './utils/functions';

export const ModalCreateCompanyAndOwner = ({
  setCompanies,
  page,
  setCount,
  setModal,
}: IModalCreateCompanyAndOwner) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [isCPF, setIsCPF] = useState<boolean>(false);

  return (
    <Modal title="Cadastrar usuário" setModal={setModal}>
      <Formik
        initialValues={{
          image: '',
          name: '',
          email: '',
          companyName: '',
          contactNumber: '',
          CPF: '',
          CNPJ: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={
          isCPF ? schemaModalCreateCompanyAndOwnerWithCPF : schemaModalCreateCompanyAndOwnerWithCNPJ
        }
        onSubmit={async (data: IFormDataCompany) => {
          await requestCreateCompanyAndOWner({
            data,
            setModal,
            setOnQuery,
            setCompanies,
            page,
            setCount,
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
                placeholder="Ex:  joao.silva@easyalert.com"
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

              <Style.SwitchWrapper>
                <h6>CNPJ</h6>
                <Switch
                  checked={isCPF}
                  onChange={() => {
                    setIsCPF((state) => !state);
                    if (isCPF) {
                      setFieldValue('CNPJ', '');
                    } else {
                      setFieldValue('CPF', '');
                    }
                  }}
                />
                <h6>CPF</h6>
              </Style.SwitchWrapper>

              {isCPF && (
                <FormikInput
                  name="CPF"
                  maxLength={applyMask({ value: values.CPF, mask: 'CPF' }).length}
                  value={values.CPF}
                  error={touched.CPF && errors.CPF ? errors.CPF : null}
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    setFieldValue('CPF', applyMask({ value: e.target.value, mask: 'CPF' }).value);
                  }}
                />
              )}

              {!isCPF && (
                <FormikInput
                  name="CNPJ"
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
                placeholder="Crie uma senha de 8 caracteres"
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
                placeholder="Confirme a senha criada"
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
