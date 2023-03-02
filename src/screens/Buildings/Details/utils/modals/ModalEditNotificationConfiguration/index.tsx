// LIBS
import { useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import * as Style from './styles';
import { Button } from '../../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../components/Modal';
import { FormikCheckbox } from '../../../../../../components/Form/FormikCheckbox';
import { theme } from '../../../../../../styles/theme';

// TYPES
import { IModalEditNotificationConfiguration } from './utils/types';

// FUNCTIONS
import {
  requestDeleteNotificationConfiguration,
  requestEditNotificationConfiguration,
  schemaEditNotificationConfiguration,
} from './utils/functions';
import { applyMask } from '../../../../../../utils/functions';
import { PopoverButton } from '../../../../../../components/Buttons/PopoverButton';

export const ModalEditNotificationConfiguration = ({
  setModal,
  buildingId,
  setBuilding,
  selectedNotificationRow,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
  emailConfirmUrl,
  phoneConfirmUrl,
}: IModalEditNotificationConfiguration) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Editar responsável de manutenção" setModal={setModal}>
      <Formik
        initialValues={{
          name: selectedNotificationRow.name,
          email: selectedNotificationRow.email ?? '',
          contactNumber: selectedNotificationRow.contactNumber
            ? applyMask({ mask: 'TEL', value: selectedNotificationRow.contactNumber }).value
            : '',
          role: selectedNotificationRow.role,
          isMain: selectedNotificationRow.isMain,
        }}
        validationSchema={schemaEditNotificationConfiguration}
        onSubmit={async (values) => {
          requestEditNotificationConfiguration({
            buildingId,
            buildingNotificationConfigurationId: selectedNotificationRow.id,
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

              <Style.ButtonContainer>
                {!onQuery && (
                  <PopoverButton
                    actionButtonBgColor={theme.color.actionDanger}
                    borderless
                    type="Button"
                    label="Excluir"
                    message={{
                      title: 'Deseja excluir este dado de notificação?',
                      content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                      contentColor: theme.color.danger,
                    }}
                    actionButtonClick={() => {
                      requestDeleteNotificationConfiguration({
                        buildingNotificationConfigurationId: selectedNotificationRow.id,
                        setModal,
                        setOnQuery,
                        setBuilding,
                        buildingId,
                        setTotalMaintenancesCount,
                        setUsedMaintenancesCount,
                      });
                    }}
                  />
                )}
                <Button label="Salvar" type="submit" loading={onQuery} />
              </Style.ButtonContainer>
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
