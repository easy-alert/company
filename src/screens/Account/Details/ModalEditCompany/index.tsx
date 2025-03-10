// REACT
import { useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { updateCompany } from '@services/apis/updateCompany';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikImageInput } from '@components/Form/FormikImageInput';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';

// GLOBAL FUNCTIONS
import { IAccount, TTranslateTicketType } from '@utils/types';
import { applyMask, translateTicketType, uploadFile } from '@utils/functions';

// UTILS
import { schemaModalEditAccountWithCNPJ, schemaModalEditAccountWithCPF } from './schema';

interface IModalEditCompany {
  company: IAccount['Company'];
  handleModals: (modal: string, setModal: boolean) => void;
}

export const ModalEditCompany = ({ company, handleModals }: IModalEditCompany) => {
  const { handleChangeCompany } = useAuthContext();

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const ticketTypes = [
    'none',
    'whatsapp',
    'email',
    'link',
    'platform',
  ].sort() as TTranslateTicketType[];

  const displayExtraTicketField = ['whatsapp', 'email', 'link'].sort() as TTranslateTicketType[];

  const handleEditAccount = async (values: any) => {
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
        image: imageUrl,
      };

      const updatedCompany = await updateCompany({
        data,
        company,
      });

      if (!updatedCompany) return;

      handleChangeCompany(updatedCompany);
    } finally {
      setOnQuery(false);
      handleModals('editAccount', false);
    }
  };

  return (
    <Modal title="Editar empresa" setModal={(state) => handleModals('editAccount', state)}>
      <Formik
        initialValues={{
          image: company.image,
          companyName: company.name,
          contactNumber: applyMask({
            value: company.contactNumber,
            mask: 'TEL',
          }).value,
          CPF: company.CPF ? applyMask({ value: company.CPF, mask: 'CPF' }).value : '',
          CNPJ: company.CNPJ ? applyMask({ value: company.CNPJ, mask: 'CNPJ' }).value : '',
          ticketType: company.ticketType,
          ticketInfo: company.ticketInfo || '',
          showMaintenancePriority: company.showMaintenancePriority || false,
        }}
        validationSchema={
          company.CPF ? schemaModalEditAccountWithCPF : schemaModalEditAccountWithCNPJ
        }
        onSubmit={async (values) => {
          await handleEditAccount(values);
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
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
              label="Nome da empresa *"
              name="companyName"
              value={values.companyName}
              error={touched.companyName && errors.companyName ? errors.companyName : null}
              placeholder="Ex: Easy Alert"
            />

            <FormikInput
              label="Telefone *"
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
                label="CPF *"
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

            <FormikCheckbox
              name="showMaintenancePriority"
              label="Mostrar prioridade de manutenção"
              checked={values.showMaintenancePriority}
              onChange={() =>
                setFieldValue('showMaintenancePriority', !values.showMaintenancePriority)
              }
            />

            <Button
              type="submit"
              label="Salvar"
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
