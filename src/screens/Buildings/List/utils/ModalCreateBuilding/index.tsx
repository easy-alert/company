// LIBS
import { useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import * as Style from './styles';
import { Button } from '../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../components/Modal';
import { FormikSelect } from '../../../../../components/Form/FormikSelect';
import { FormikCheckbox } from '../../../../../components/Form/FormikCheckbox';
import { theme } from '../../../../../styles/theme';

// TYPES
import { IModalCreateBuilding } from './utils/types';

// FUNCTIONS
import { requestCreateBuilding, schemaModalCreateBuilding } from './utils/functions';
import {
  applyMask,
  capitalizeFirstLetter,
  requestAddressData,
} from '../../../../../utils/functions';

export const ModalCreateBuilding = ({
  setModal,
  page,
  setBuildingList,
  setCount,
  buildingTypes,
}: IModalCreateBuilding) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

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
          area: '',
          deliveryDate: '',
          warrantyExpiration: '',
          keepNotificationAfterWarrantyEnds: false,
        }}
        validationSchema={schemaModalCreateBuilding}
        onSubmit={async (values) => {
          requestCreateBuilding({ setModal, setOnQuery, values, page, setCount, setBuildingList });
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
                placeholder="Ex: Monte Ravello"
                maxLength={40}
              />
              <FormikSelect
                label="Tipo"
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
                  if (
                    e.target.value.length === 9 ||
                    (e.target.value.length === 8 && !e.target.value.includes('-'))
                  ) {
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
                label="Área (m²)"
                name="area"
                value={values.area}
                error={touched.area && errors.area ? errors.area : null}
                placeholder="Ex: 1.200,00"
                maxLength={10}
                onChange={(e) => {
                  if (/^\d/.test(e.target.value) || e.target.value === '') {
                    if (e.target.value === '' || e.target.value === '0,0') {
                      setFieldValue('area', '');
                    } else {
                      setFieldValue(
                        'area',
                        applyMask({ value: e.target.value, mask: 'DEC' }).value,
                      );
                    }
                  }
                }}
              />
              <FormikInput
                typeDatePlaceholderValue={values.deliveryDate}
                type="date"
                label="Entrega da edificação"
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
                    const deliveryDatePlusFiveYearsString = new Date(deliveryDatePlusFiveYears)
                      .toISOString()
                      .split('T')[0];

                    setFieldValue('warrantyExpiration', deliveryDatePlusFiveYearsString);
                  } else {
                    setFieldValue('warrantyExpiration', e.target.value);
                  }
                }}
              />

              <FormikInput
                typeDatePlaceholderValue={values.warrantyExpiration}
                type="date"
                label="Término da garantia"
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
              <Button center label="Cadastrar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
