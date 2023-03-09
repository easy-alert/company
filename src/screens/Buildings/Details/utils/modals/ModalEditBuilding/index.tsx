// LIBS
import { useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Style from './styles';
import { Button } from '../../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../components/Modal';
import { FormikSelect } from '../../../../../../components/Form/FormikSelect';
import { FormikCheckbox } from '../../../../../../components/Form/FormikCheckbox';
import { theme } from '../../../../../../styles/theme';
import { PopoverButton } from '../../../../../../components/Buttons/PopoverButton';
// TYPES
import { IModalEditBuilding } from './utils/types';

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
  setBuilding,
  buildingTypes,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IModalEditBuilding) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Modal title="Editar edificação" setModal={setModal}>
      <Formik
        initialValues={{
          id: building.id,
          name: building.name,
          buildingTypeId: building.BuildingType.id,
          cep: building.cep ? applyMask({ mask: 'CEP', value: building.cep }).value : '',
          city: building.city ?? '',
          state: building.state ?? '',
          neighborhood: building.neighborhood ?? '',
          streetName: building.streetName ?? '',
          area: '',
          deliveryDate: convertToFormikDate(building.deliveryDate),
          warrantyExpiration: convertToFormikDate(building.warrantyExpiration),
          keepNotificationAfterWarrantyEnds: building.keepNotificationAfterWarrantyEnds,
        }}
        validationSchema={schemaModalEditBuilding}
        onSubmit={async (values) => {
          requestEditBuilding({
            setModal,
            setOnQuery,
            values,
            setBuilding,
            setTotalMaintenancesCount,
            setUsedMaintenancesCount,
          });
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
                maxLength={40}
              />
              <FormikSelect
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
                label="CEP"
                name="cep"
                value={values.cep}
                error={touched.cep && errors.cep ? errors.cep : null}
                placeholder="Ex: 88801-010"
                maxLength={applyMask({ value: values.cep, mask: 'CEP' }).length}
                onChange={(e) => {
                  setFieldValue('cep', applyMask({ value: e.target.value, mask: 'CEP' }).value);
                  if (applyMask({ value: e.target.value, mask: 'CEP' }).value.length === 9) {
                    requestAddressData({ cep: e.target.value, setFieldValue });
                  }
                }}
              />
              <FormikInput
                label="Estado"
                name="state"
                value={values.state}
                error={touched.state && errors.state ? errors.state : null}
                placeholder="Ex: Santa Catarina"
                maxLength={20}
              />
              <FormikInput
                label="Cidade"
                name="city"
                value={values.city}
                error={touched.city && errors.city ? errors.city : null}
                placeholder="Ex: Criciúma"
                maxLength={30}
              />
              <FormikInput
                label="Bairro"
                name="neighborhood"
                value={values.neighborhood}
                error={touched.neighborhood && errors.neighborhood ? errors.neighborhood : null}
                placeholder="Ex: Centro"
                maxLength={20}
              />
              <FormikInput
                label="Logradouro"
                name="streetName"
                value={values.streetName}
                error={touched.streetName && errors.streetName ? errors.streetName : null}
                placeholder="Ex: Rua Henrique Lage"
                maxLength={40}
              />

              <FormikInput
                typeDatePlaceholderValue={values.deliveryDate}
                type="date"
                label="Entrega da edificação"
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
              <FormikCheckbox
                name="keepNotificationAfterWarrantyEnds"
                labelColor={theme.color.gray4}
                label="Notificar após garantia?"
              />
              <Style.ButtonContainer>
                {!onQuery && (
                  <PopoverButton
                    actionButtonBgColor={theme.color.actionDanger}
                    borderless
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
                        buildingId: building.id,
                        navigate,
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
