/* eslint-disable react/no-array-index-key */
// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import { Button } from '../../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../components/Modal';
import { FormikCheckbox } from '../../../../../../components/Form/FormikCheckbox';
import { theme } from '../../../../../../styles/theme';
import { Image } from '../../../../../../components/Image';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../assets/icons';

// TYPES
import { IAutoCompleteData, IModalCreateNotificationConfiguration } from './utils/types';

// FUNCTIONS
import {
  getDataForAutoComplete,
  requestCreateNotificationConfiguration,
  schemaCreateNotificationConfiguration,
} from './utils/functions';
import { applyMask } from '../../../../../../utils/functions';
import { DataListInput } from '../../../../../../components/DataListInput';

export const ModalCreateNotificationConfiguration = ({
  setModal,
  buildingId,
  emailConfirmUrl,
  phoneConfirmUrl,
  requestBuildingDetailsCall,
}: IModalCreateNotificationConfiguration) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [autoCompleteData, setAutoCompleteData] = useState<IAutoCompleteData[]>([]);

  useEffect(() => {
    getDataForAutoComplete({ buildingId, setAutoCompleteData });
  }, []);

  return (
    <Modal title="Cadastrar responsável de manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          name: '',
          email: '',
          role: '',
          contactNumber: '',
          isMain: false,
          showContact: false,
          createAgain: false,
        }}
        validationSchema={schemaCreateNotificationConfiguration}
        onSubmit={async (values, actions) => {
          requestCreateNotificationConfiguration({
            buildingId,
            setModal,
            setOnQuery,
            values,
            emailConfirmUrl,
            phoneConfirmUrl,
            setFieldValue: actions.setFieldValue,
            resetForm: actions.resetForm,
            requestBuildingDetailsCall,
          });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              {/* <FormikDatalist
                label="Nome"
                name="name"
                placeholder="Ex: João Silva"
                datalistId="autoComplete"
                error={touched.name && errors.name ? errors.name : null}
                maxLength={60}
                onChange={(evt) => {
                  const name = evt.target.value;
                  setFieldValue('name', name);

                  const data = autoCompleteData.find((e) => e.name === name);

                  if (data) {
                    setFieldValue('email', data?.email || '');
                    setFieldValue(
                      'contactNumber',
                      data?.contactNumber
                        ? applyMask({
                            mask: 'TEL',
                            value: data.contactNumber,
                          }).value
                        : '',
                    );
                    setFieldValue('role', data?.role);
                  }
                }}
              >
                {autoCompleteData.map((data, i) => (
                  <option key={i} value={data.name}>
                    {`${data.email} - ${
                      applyMask({
                        mask: 'TEL',
                        value: data.contactNumber,
                      }).value
                    } - ${data.role}`}
                  </option>
                ))}
              </FormikDatalist> */}

              <DataListInput
                error={touched.name && errors.name ? errors.name : null}
                label="Nome"
                name="name"
                maxLength={60}
                getValue={({ value }) => {
                  const customId = value;

                  const data = autoCompleteData.find((e) => e.customId === customId);

                  if (data) {
                    setFieldValue('name', data.name);
                    setFieldValue('email', data?.email || '');
                    setFieldValue(
                      'contactNumber',
                      data?.contactNumber
                        ? applyMask({
                            mask: 'TEL',
                            value: data.contactNumber,
                          }).value
                        : '',
                    );
                    setFieldValue('role', data?.role);
                  }
                }}
                getValueOnChange={({ value }) => {
                  setFieldValue('name', value);
                }}
                options={autoCompleteData.map((data) => ({
                  label: data.name,
                  extraLabel: `${data.email || 'Sem email'} - ${
                    data.contactNumber
                      ? applyMask({
                          mask: 'TEL',
                          value: data.contactNumber,
                        }).value
                      : 'Sem WhatsApp'
                  } - ${data.role}`,
                  value: data.customId,
                }))}
              />

              {/*
              <FormikInput
                label="Nome"
                name="name"
                value={values.name}
                error={touched.name && errors.name ? errors.name : null}
                placeholder="Ex: João Silva"
                maxLength={60}
              /> */}

              <FormikInput
                label="E-mail"
                name="email"
                value={values.email}
                error={touched.email && errors.email ? errors.email : null}
                placeholder="Ex: joaosilva@gmail.com"
                maxLength={50}
              />
              <FormikInput
                label="WhatsApp"
                name="contactNumber"
                value={values.contactNumber}
                error={touched.contactNumber && errors.contactNumber ? errors.contactNumber : null}
                placeholder="Ex: (00) 00000-0000"
                maxLength={applyMask({ value: values.contactNumber, mask: 'TEL' }).length}
                onChange={(e) => {
                  setFieldValue(
                    'contactNumber',
                    applyMask({ value: e.target.value, mask: 'TEL' }).value,
                  );
                }}
              />
              <FormikInput
                label="Função"
                name="role"
                value={values.role}
                error={touched.role && errors.role ? errors.role : null}
                placeholder="Ex: Síndico"
                maxLength={50}
              />

              <Style.MainContactObservation>
                <Image img={icon.alert} size="16px" />
                <p className="p3">Apenas o contato principal receberá notificações por WhatsApp.</p>
              </Style.MainContactObservation>

              <FormikCheckbox
                name="isMain"
                labelColor={theme.color.gray4}
                label="Contato principal"
              />

              <FormikCheckbox
                name="showContact"
                labelColor={theme.color.gray4}
                label="Exibir no QR Code"
              />

              <FormikCheckbox
                name="createAgain"
                labelColor={theme.color.gray4}
                label="Salvar e criar outro"
              />

              <Style.ButtonContainer>
                <Button label="Cadastrar" type="submit" loading={onQuery} />
              </Style.ButtonContainer>
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
