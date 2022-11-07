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
              <FormikInput
                label="Tipo"
                name="type"
                value={values.type}
                error={touched.type && errors.type ? errors.type : null}
                placeholder="Ex: João Silva"
                maxLength={40}
              />
              <FormikInput
                label="CEP"
                name="cep"
                value={values.cep}
                error={touched.cep && errors.cep ? errors.cep : null}
                placeholder="Ex: João Silva"
              />
              <FormikInput
                label="Cidade"
                name="city"
                value={values.city}
                error={touched.city && errors.city ? errors.city : null}
                placeholder="Ex: João Silva"
                maxLength={30}
              />
              <FormikInput
                label="Estado"
                name="state"
                value={values.state}
                error={touched.state && errors.state ? errors.state : null}
                placeholder="Ex: João Silva"
                maxLength={20}
              />
              <FormikInput
                label="Bairro"
                name="neighborhood"
                value={values.neighborhood}
                error={touched.neighborhood && errors.neighborhood ? errors.neighborhood : null}
                placeholder="Ex: João Silva"
                maxLength={20}
              />
              <FormikInput
                label="Logradouro"
                name="streetName"
                value={values.streetName}
                error={touched.streetName && errors.streetName ? errors.streetName : null}
                placeholder="Ex: João Silva"
                maxLength={40}
              />
              <FormikInput
                label="Área (m²)"
                name="deliveryDate"
                value={values.deliveryDate}
                error={touched.deliveryDate && errors.deliveryDate ? errors.deliveryDate : null}
                placeholder="Ex: João Silva"
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
                value={values.name}
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
