// REACT
import { useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import { FormikInput } from '@components/Form/FormikInput';
import * as yup from 'yup';

// SERVICES
import { putMaintenanceHistory } from '@services/apis/putMaintenanceHistory';

// COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';

import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL FUNCTIONS
import { convertToFormikDate } from '@utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalEditMaintenanceHistory } from './types';

export const ModalEditMaintenanceHistory = ({
  userId,
  maintenance,
  handleEditModal,
  handleRefresh,
}: IModalEditMaintenanceHistory) => {
  const [loading, setLoading] = useState(false);

  // Calculate the limit date
  const daysToAdd =
    (maintenance.Maintenance.FrequencyTimeInterval?.unitTime ?? 0) *
      (maintenance.Maintenance.frequency ?? 0) -
    1;

  const notificationDate = new Date(maintenance.notificationDate);
  const limitDate = new Date(notificationDate.setDate(notificationDate.getDate() + daysToAdd));

  const schema = yup.object().shape({
    dueDate: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-date', 'Data de vencimento não pode ser maior que a data limite', (value) => {
        if (!value) return false;

        // Parse the new due date
        const newDueDate = new Date(`${value}T00:00:00`);

        // Validate the dates
        return newDueDate < limitDate; // Return true if valid, false otherwise
      }),
  });

  const handleEditMaintenanceHistory = async (values: any) => {
    setLoading(true);

    try {
      const data = {
        id: maintenance.id,
        dueDate: new Date(`${values.dueDate}T00:00:00`),
      };

      await putMaintenanceHistory(data);
      handleEditModal(false);
      handleRefresh();
    } catch (error) {
      console.error('Error updating maintenance history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      bodyWidth="475px"
      title="Editar manutenção"
      zIndex={15}
      setModal={(modalState) => handleEditModal(modalState)}
    >
      {loading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <h3>{maintenance?.Building.name}</h3>

          <Formik
            initialValues={{
              dueDate: convertToFormikDate(maintenance.dueDate),
            }}
            validationSchema={schema}
            onSubmit={async (values) => handleEditMaintenanceHistory(values)}
          >
            {({ errors, values, touched }) => (
              <Form>
                {maintenance.Maintenance.MaintenanceType.name === 'common' ? (
                  <>
                    <p>
                      A data limite para esta manutenção é:{' '}
                      <strong>{limitDate.toLocaleDateString()}</strong>
                    </p>
                    <FormikInput
                      name="dueDate"
                      label="Data de vencimento"
                      placeholder="Data de vencimento"
                      type="date"
                      value={values.dueDate}
                      error={touched.dueDate && errors.dueDate ? errors.dueDate : null}
                    />
                  </>
                ) : (
                  <p>Manutenção avulsa não possui data de vencimento</p>
                )}

                <Style.ButtonContainer>
                  <Button
                    type="submit"
                    label="Salvar"
                    disable={maintenance.Maintenance.MaintenanceType.name === 'occasional'}
                  />
                </Style.ButtonContainer>
              </Form>
            )}
          </Formik>
        </Style.Container>
      )}
    </Modal>
  );
};
