// LIBS
import { useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import * as Style from './styles';
import { Button } from '../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../components/Modal';
import { FormikCheckbox } from '../../../../../components/Form/FormikCheckbox';
import { theme } from '../../../../../styles/theme';

// TYPES
import { IModalEditNotificationConfiguration } from './utils/types';

// FUNCTIONS
import {
  requestEditNotificationConfiguration,
  schemaEditNotificationConfiguration,
} from './utils/functions';
import { applyMask } from '../../../../../utils/functions';

export const ModalEditNotificationConfiguration = ({
  setModal,
  buildingId,
}: IModalEditNotificationConfiguration) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Editar dados de notificação" setModal={setModal}>
      <Formik
        initialValues={{
          name: '',
          email: '',
          role: '',
          contactNumber: '',
          isMain: false,
        }}
        validationSchema={schemaEditNotificationConfiguration}
        onSubmit={async (values) => {
          requestEditNotificationConfiguration({ buildingId, setModal, setOnQuery, values });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              <FormikInput
                label="Nome"
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
                placeholder="Ex: joaosilva@gmail.com"
                maxLength={40}
              />
              <FormikInput
                label="Função"
                name="role"
                value={values.role}
                error={touched.role && errors.role ? errors.role : null}
                placeholder="Ex: Síndico"
                maxLength={40}
              />
              <FormikInput
                label="WhatsApp"
                name="contactNumber"
                value={values.contactNumber}
                error={touched.contactNumber && errors.contactNumber ? errors.contactNumber : null}
                placeholder="Ex: (48) 00000-0000"
                maxLength={applyMask({ value: values.contactNumber, mask: 'TEL' }).length}
                onChange={(e) => {
                  setFieldValue(
                    'contactNumber',
                    applyMask({ value: e.target.value, mask: 'TEL' }).value,
                  );
                }}
              />

              <FormikCheckbox name="isMain" labelColor={theme.color.gray4} label="Principal" />

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
