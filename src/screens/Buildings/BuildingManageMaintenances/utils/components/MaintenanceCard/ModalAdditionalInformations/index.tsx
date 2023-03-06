// COMPONENTS
import { Form, Formik } from 'formik';
import { Button } from '../../../../../../../components/Buttons/Button';
import { FormikCheckbox } from '../../../../../../../components/Form/FormikCheckbox';
import { Modal } from '../../../../../../../components/Modal';
import { FormikInput } from '../../../../../../../components/Form/FormikInput';

// STYLES
import * as Style from './styles';

// FUNCTIONS
import { handleAdditionalInformations, schemaAdditionalInformations } from './functions';

// TYPES
import { IModalAdditionalInformations } from './types';
import { increaseDaysInDate } from '../../../../../../../utils/functions';

export const ModalAdditionalInformations = ({
  setModal,
  setCategories,
  categoryIndex,
  maintenanceIndex,
}: IModalAdditionalInformations) => (
  <Modal title="Informações adicionais" setModal={setModal}>
    <Formik
      initialValues={{
        hasLastResolutionDate: false,
        lastResolutionDate: '',
        hasFirstNotificationDate: false,
        firstNotificationDate: '',
      }}
      validationSchema={schemaAdditionalInformations}
      onSubmit={(values) => {
        handleAdditionalInformations({
          setCategories,
          values,
          categoryIndex,
          maintenanceIndex,
          setModal,
        });
      }}
    >
      {({ errors, values, touched, setFieldValue, setTouched }) => (
        <Form>
          <Style.Wrapper>
            <FormikCheckbox
              label="Informar data da última conclusão"
              name="hasLastResolutionDate"
              onChange={() => {
                setFieldValue('hasLastResolutionDate', !values.hasLastResolutionDate);

                if (values.lastResolutionDate) {
                  setTouched({ lastResolutionDate: false });
                  setFieldValue('lastResolutionDate', '');
                }
              }}
            />
            <FormikInput
              max={new Date().toISOString().split('T')[0]}
              disabled={!values.hasLastResolutionDate}
              name="lastResolutionDate"
              type="date"
              value={values.lastResolutionDate}
              error={
                touched.lastResolutionDate && errors.lastResolutionDate
                  ? errors.lastResolutionDate
                  : null
              }
              placeholder="Ex: João Silva"
              maxLength={40}
            />
          </Style.Wrapper>
          <Style.Wrapper>
            <FormikCheckbox
              label="Informar data da primeira notificação"
              name="hasFirstNotificationDate"
              onChange={() => {
                setFieldValue('hasFirstNotificationDate', !values.hasFirstNotificationDate);

                if (values.firstNotificationDate) {
                  setTouched({ firstNotificationDate: false });
                  setFieldValue('firstNotificationDate', '');
                }
              }}
            />
            <FormikInput
              min={increaseDaysInDate({ date: new Date(), daysToIncrease: 1 })}
              disabled={!values.hasFirstNotificationDate}
              name="firstNotificationDate"
              type="date"
              value={values.firstNotificationDate}
              error={
                touched.firstNotificationDate && errors.firstNotificationDate
                  ? errors.firstNotificationDate
                  : null
              }
              placeholder="Ex: João Silva"
              maxLength={40}
            />
          </Style.Wrapper>
          <Button
            disable={!values.hasFirstNotificationDate && !values.hasLastResolutionDate}
            style={{ marginTop: '8px' }}
            center
            label="Salvar"
            type="submit"
          />
        </Form>
      )}
    </Formik>
  </Modal>
);
