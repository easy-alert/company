// LIBS
import { useState } from 'react';

// COMPONENTS
import { Form, Formik } from 'formik';
import * as Style from './styles';
import { Button } from '../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../components/Modal';

// TYPES
import { IModalCreateBuilding } from './utils/types';

// FUNCTIONS
import { schemaModalCreateBuilding } from './utils/functions';
import { FormikSelect } from '../../../../../components/Form/FormikSelect';

export const ModalCreateBuilding = ({ setModal }: IModalCreateBuilding) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Cadastrar edificação" setModal={setModal}>
      <Formik
        initialValues={{
          name: '',
          type: '',
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
          setOnQuery(true);
          // eslint-disable-next-line no-console
          console.log(values);
          setOnQuery(false);
          // await requestEditAccount({
          //   values,
          //   account,
          //   setAccount,
          //   navigate,
          //   setOnQuery,
          //   setModal,
          // });
        }}
      >
        {({ errors, values, touched }) => (
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
              <FormikSelect
                label="Tipo"
                name="type"
                value={values.type}
                selectPlaceholderValue={values.type}
                error={touched.type && errors.type ? errors.type : null}
              >
                <option value="">Selecione</option>
              </FormikSelect>
              <FormikInput
                label="CEP"
                name="cep"
                value={values.cep}
                error={touched.cep && errors.cep ? errors.cep : null}
                placeholder="Ex: 88801-010"
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
                maxLength={40}
              />
              <FormikInput
                type="date"
                label="Data de entrega da edificação"
                name="deliveryDate"
                value={values.deliveryDate}
                error={touched.deliveryDate && errors.deliveryDate ? errors.deliveryDate : null}
              />
              <FormikInput
                type="date"
                label="Término da garantia"
                name="keepNotificationAfterWarrantyEnds"
                value={values.warrantyExpiration}
                error={
                  touched.warrantyExpiration && errors.warrantyExpiration
                    ? errors.warrantyExpiration
                    : null
                }
              />
              <FormikInput
                type="checkbox"
                label="Continuar notificando após término da garantia?"
                name="keepNotificationAfterWarrantyEnds"
                error={touched.name && errors.name ? errors.name : null}
              />
              <Button center label="Salvar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
