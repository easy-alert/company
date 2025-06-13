// REACT
import { useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import * as yup from 'yup';

// HOOKS
import { useHasPermission } from '@hooks/useHasPermission';

// SERVICES
import { putMaintenanceHistory } from '@services/apis/putMaintenanceHistory';

// COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';
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
  const { hasPermission } = useHasPermission({
    permToCheck: ['admin:company', 'manager:maintenances'],
  });

  const [loading, setLoading] = useState(false);

  // Calculate the limit date
  const daysToAdd =
    (maintenance?.Maintenance?.FrequencyTimeInterval?.unitTime ?? 0) *
      (maintenance?.Maintenance?.frequency ?? 0) -
    1;

  const notificationDate = new Date(maintenance.notificationDate ?? '');
  const limitDate = new Date(notificationDate); // Create a new Date object based on notificationDate
  limitDate.setDate(notificationDate.getDate() + daysToAdd); // Mutate only the new limitDate object

  const schema = yup.object().shape({
    dueDate: yup
      .string()
      .test(
        'is-valid-date',
        'Data de vencimento não pode ser maior que a data limite nem menor que a data de notificação',
        (value) => {
          if (maintenance?.Maintenance?.MaintenanceType?.name !== 'common') return true; // Skip validation for non-common maintenance

          if (!value) return false;

          // Parse the new due date
          const newDueDate = new Date(`${value}T03:00:00`);

          // Validate the dates
          return notificationDate < newDueDate && newDueDate < limitDate; // Return true if valid, false otherwise
        },
      ),
    showToResident: yup.boolean().required('Campo obrigatório'),
  });

  const handleEditMaintenanceHistory = async (values: any) => {
    setLoading(true);

    try {
      const formattedDueDate = new Date(`${values.dueDate}T00:00:00`);
      const newStatus = new Date() > formattedDueDate ? 'expired' : 'pending';

      const data = {
        maintenanceHistoryId: maintenance.id,
        dueDate: formattedDueDate,
        maintenanceStatus: newStatus,
        showToResident: values.showToResident,
      };

      await putMaintenanceHistory(data);

      handleEditModal(false);
      if (handleRefresh) handleRefresh();
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
          <h3>{maintenance?.Building?.name}</h3>

          <Formik
            initialValues={{
              dueDate: convertToFormikDate(maintenance.dueDate ?? '') ?? '',
              showToResident: maintenance?.showToResident ?? false,
            }}
            validationSchema={schema}
            onSubmit={async (values) => {
              console.log('🚀 ~ onSubmit={ ~ values:', values);
              await handleEditMaintenanceHistory(values);
            }}
          >
            {({ errors, values, touched }) => (
              <Form>
                <Style.FormContainer>
                  {maintenance?.MaintenancesStatus?.name !== 'completed' &&
                    maintenance?.MaintenancesStatus?.name !== 'overdue' && (
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      <>
                        {maintenance?.Maintenance?.MaintenanceType?.name === 'common' ? (
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
                      </>
                    )}

                  {hasPermission && (
                    <FormikCheckbox
                      name="showToResident"
                      label="Mostrar para o morador"
                      checked={values.showToResident}
                      error={
                        touched.showToResident && errors.showToResident
                          ? errors.showToResident
                          : null
                      }
                    />
                  )}

                  <Style.ButtonContainer>
                    <Button type="submit" label="Salvar" bgColor="primary" />
                  </Style.ButtonContainer>
                </Style.FormContainer>
              </Form>
            )}
          </Formik>
        </Style.Container>
      )}
    </Modal>
  );
};
