// LIBS
import { useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/Buttons/Button';
import { FormikImageInput } from '@components/Form/FormikImageInput';
import { FormikInput } from '@components/Form/FormikInput';
import { Modal } from '@components/Modal';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';
import { theme } from '@styles/theme';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import * as Style from './styles';

// TYPES
import type { IModalEditBuilding, IEditBuilding } from './utils/types';

// FUNCTIONS
import {
  requestDeleteBuilding,
  requestEditBuilding,
  schemaModalEditBuilding,
} from './utils/functions';
import {
  applyMask,
  capitalizeFirstLetter,
  convertToFormikDate,
  requestAddressData,
} from '../../../../../../utils/functions';

export const ModalEditBuilding = ({
  setModal,
  building,
  buildingTypes,
  requestBuildingDetailsCall,
}: IModalEditBuilding) => {
  const navigate = useNavigate();

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean | null>(null);

  return (
    <Modal title="Editar edificação" setModal={setModal}>
      <Formik
        initialValues={{
          id: building.id,
          image: building.image,
          name: building.name,
          buildingTypeId: building.BuildingType?.id,
          cep: building.cep ? applyMask({ mask: 'CEP', value: building.cep }).value : '',
          city: building.city ?? '',
          state: building.state ?? '',
          neighborhood: building.neighborhood ?? '',
          streetName: building.streetName ?? '',
          area: '',
          deliveryDate: convertToFormikDate(new Date(building.deliveryDate ?? '')),
          warrantyExpiration: convertToFormikDate(new Date(building.warrantyExpiration ?? '')),
          keepNotificationAfterWarrantyEnds: building.keepNotificationAfterWarrantyEnds,
          mandatoryReportProof: building.mandatoryReportProof,
          nextMaintenanceCreationBasis: building.nextMaintenanceCreationBasis,
          isActivityLogPublic: building.isActivityLogPublic,
          guestCanCompleteMaintenance: building.guestCanCompleteMaintenance,
          showAllTicketsToResident: building.showAllTicketsToResident,
          ticketAnnexRequired: building.ticketAnnexRequired,
        }}
        validationSchema={schemaModalEditBuilding}
        onSubmit={async (values) => {
          await requestEditBuilding({
            setModal,
            setOnQuery,
            values: values as IEditBuilding,
            requestBuildingDetailsCall,
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
                onChange={(event: any) => {
                  if (event.target.files?.length) {
                    setFieldValue('image', event.target.files[0]);
                  }
                }}
              />

              <FormikInput
                label="Nome *"
                name="name"
                value={values.name}
                error={touched.name && errors.name ? errors.name : null}
                placeholder="Ex: Monte Ravello"
              />
              <FormikSelect
                label="Tipo *"
                arrowColor="primary"
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
                  if (applyMask({ value: e.target.value, mask: 'CEP' }).value.length === 9) {
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
                label="Data de início"
                name="deliveryDate"
                value={values.deliveryDate}
                error={touched.deliveryDate && errors.deliveryDate ? errors.deliveryDate : null}
                disabled
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
                selectPlaceholderValue={values.nextMaintenanceCreationBasis}
                label="Próxima manutenção baseada em *"
                arrowColor="primary"
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

              <FormikCheckbox
                name="showAllTicketsToResident"
                labelColor={theme.color.gray4}
                label="Mostrar todos os chamados para morador?"
              />

              <FormikCheckbox
                name="ticketAnnexRequired"
                labelColor={theme.color.gray4}
                label="Anexos de chamados obrigatórios?"
              />

              <Style.ButtonContainer>
                {!onQuery && (
                  <PopoverButton
                    actionButtonBgColor={theme.color.actionDanger}
                    borderless
                    textColor="actionDanger"
                    type="Button"
                    label="Excluir"
                    message={{
                      title: 'Deseja excluir esta edificação?',
                      content:
                        'Atenção, todos os dados relacionados serão excluídos e essa ação não poderá ser desfeita.',
                      contentColor: theme.color.danger,
                    }}
                    actionButtonClick={() => {
                      requestDeleteBuilding({
                        setModal,
                        setOnQuery,
                        buildingId: building.id || '',
                        navigate,
                      });
                    }}
                  />
                )}

                <Button label="Salvar" type="submit" loading={onQuery} bgColor="primary" />
              </Style.ButtonContainer>
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
