import { useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { Modal } from '@components/Modal';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL UTILS
import {
  applyMask,
  capitalizeFirstLetter,
  convertToFormikDate,
  requestAddressData,
} from '@utils/functions';

// COMPONENTS
import * as Style from './styles';

// TYPES
import { IModalCreateBuilding } from './utils/types';

// UTILS
import { requestCreateBuilding, schemaModalCreateBuilding } from './utils/functions';

export const ModalCreateBuilding = ({ setModal, buildingTypes }: IModalCreateBuilding) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean | null>(null);

  const navigate = useNavigate();

  return (
    <Modal title="Cadastrar edificação" setModal={setModal}>
      <Formik
        initialValues={{
          name: '',
          buildingTypeId: '',
          cep: '',
          city: '',
          state: '',
          neighborhood: '',
          streetName: '',
          deliveryDate: '',
          warrantyExpiration: '',
          keepNotificationAfterWarrantyEnds: true,
          mandatoryReportProof: false,
          nextMaintenanceCreationBasis: 'executionDate',
          isActivityLogPublic: false,
          guestCanCompleteMaintenance: false,
        }}
        validationSchema={schemaModalCreateBuilding}
        onSubmit={async (values) => {
          requestCreateBuilding({ setModal, setOnQuery, values, navigate });
        }}
      >
        {({ errors, values, touched, setFieldValue }) => (
          <Style.FormContainer>
            <Form>
              <FormikInput
                label="Nome *"
                name="name"
                value={values.name}
                error={touched.name && errors.name ? errors.name : null}
                placeholder="Ex: Monte Ravello"
              />

              <FormikSelect
                arrowColor="primary"
                label="Tipo *"
                name="buildingTypeId"
                value={values.buildingTypeId}
                selectPlaceholderValue={values.buildingTypeId}
                error={
                  touched.buildingTypeId && errors.buildingTypeId ? errors.buildingTypeId : null
                }
              >
                <option value="" disabled hidden>
                  Selecione
                </option>

                {buildingTypes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {capitalizeFirstLetter(e.name)}
                  </option>
                ))}
              </FormikSelect>

              <FormikInput
                label="CEP *"
                name="cep"
                value={values.cep}
                error={touched.cep && errors.cep ? errors.cep : null}
                placeholder="Ex: 88801-010"
                maxLength={applyMask({ value: values.cep, mask: 'CEP' }).length}
                onChange={(e) => {
                  setFieldValue('cep', applyMask({ value: e.target.value, mask: 'CEP' }).value);
                  if (
                    e.target.value.length === 9 ||
                    (e.target.value.length === 8 && !e.target.value.includes('-'))
                  ) {
                    requestAddressData({ cep: e.target.value, setFieldValue, setApiError });
                  }
                }}
              />
              <FormikInput
                disabled={!apiError}
                label="Estado *"
                name="state"
                value={values.state}
                error={touched.state && errors.state ? errors.state : null}
                placeholder="Ex: Santa Catarina"
              />
              <FormikInput
                disabled={!apiError}
                label="Cidade *"
                name="city"
                value={values.city}
                error={touched.city && errors.city ? errors.city : null}
                placeholder="Ex: Criciúma"
              />
              <FormikInput
                label="Bairro"
                name="neighborhood"
                value={values.neighborhood}
                error={touched.neighborhood && errors.neighborhood ? errors.neighborhood : null}
                placeholder="Ex: Centro"
              />
              <FormikInput
                label="Logradouro"
                name="streetName"
                value={values.streetName}
                error={touched.streetName && errors.streetName ? errors.streetName : null}
                placeholder="Ex: Rua Henrique Lage"
              />

              <FormikInput
                typeDatePlaceholderValue={values.deliveryDate}
                type="date"
                label="Data de início *"
                name="deliveryDate"
                value={values.deliveryDate}
                error={touched.deliveryDate && errors.deliveryDate ? errors.deliveryDate : null}
                onChange={(e) => {
                  setFieldValue('deliveryDate', e.target.value);
                  // Se os 4 dígitos do ano estiverem preenchidos e o ano for menor que 9994 seta 5 anos a mais na data de garantia, se não, seta o mesmo valor pra não crashar
                  if (
                    String(new Date(e.target.value).getFullYear()).length === 4 &&
                    new Date(e.target.value).getFullYear() <= 9994
                  ) {
                    const deliveryDate = new Date(e.target.value);
                    const warrantyYear = deliveryDate.getFullYear() + 5;
                    const deliveryDatePlusFiveYears = deliveryDate.setFullYear(warrantyYear);
                    const deliveryDatePlusFiveYearsString = convertToFormikDate(
                      new Date(new Date(deliveryDatePlusFiveYears).setUTCHours(3, 0, 0, 0)),
                    );

                    setFieldValue('warrantyExpiration', deliveryDatePlusFiveYearsString);
                  } else {
                    setFieldValue('warrantyExpiration', e.target.value);
                  }
                }}
              />

              <FormikInput
                typeDatePlaceholderValue={values.warrantyExpiration}
                type="date"
                label="Término da garantia *"
                name="warrantyExpiration"
                value={values.warrantyExpiration}
                error={
                  touched.warrantyExpiration && errors.warrantyExpiration
                    ? errors.warrantyExpiration
                    : null
                }
              />

              <FormikSelect
                arrowColor="primary"
                selectPlaceholderValue={values.nextMaintenanceCreationBasis}
                label="Próxima manutenção baseada em *"
                name="nextMaintenanceCreationBasis"
                error={
                  touched.nextMaintenanceCreationBasis && errors.nextMaintenanceCreationBasis
                    ? errors.nextMaintenanceCreationBasis
                    : null
                }
              >
                <option value="executionDate">Data de execução</option>
                <option value="notificationDate">Data de notificação</option>
              </FormikSelect>

              <FormikCheckbox
                name="keepNotificationAfterWarrantyEnds"
                labelColor={theme.color.gray4}
                label="Notificar após garantia?"
              />

              <FormikCheckbox
                name="mandatoryReportProof"
                labelColor={theme.color.gray4}
                label="Comprovantes de relato obrigatórios?"
              />

              <FormikCheckbox
                name="isActivityLogPublic"
                labelColor={theme.color.gray4}
                label="Tornar logs de atividade público?"
              />

              <FormikCheckbox
                name="guestCanCompleteMaintenance"
                labelColor={theme.color.gray4}
                label="Convidado pode concluir manutenção?"
              />

              <Button center label="Cadastrar" type="submit" loading={onQuery} bgColor="primary" />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
