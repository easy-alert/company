// LIBS
import { useState } from 'react';

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
import { IModalCreateNotificationConfiguration } from './utils/types';

// FUNCTIONS
import {
  requestCreateNotificationConfiguration,
  schemaCreateNotificationConfiguration,
} from './utils/functions';
import { applyMask } from '../../../../../../utils/functions';

export const ModalCreateNotificationConfiguration = ({
  setModal,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
  emailConfirmUrl,
  phoneConfirmUrl,
}: IModalCreateNotificationConfiguration) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Cadastrar responsável de manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          name: '',
          email: '',
          role: '',
          contactNumber: '',
          isMain: false,
        }}
        validationSchema={schemaCreateNotificationConfiguration}
        onSubmit={async (values) => {
          requestCreateNotificationConfiguration({
            buildingId,
            setModal,
            setOnQuery,
            values,
            setBuilding,
            setTotalMaintenancesCount,
            setUsedMaintenancesCount,
            emailConfirmUrl,
            phoneConfirmUrl,
          });
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
                maxLength={40}
              />

              <FormikCheckbox
                name="isMain"
                labelColor={theme.color.gray4}
                label="Contato principal"
              />
              <Style.MainContactObservation>
                <Image img={icon.alert} size="16px" />
                <p className="p3">Apenas o contato principal receberá notificações por WhatsApp.</p>
              </Style.MainContactObservation>

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
