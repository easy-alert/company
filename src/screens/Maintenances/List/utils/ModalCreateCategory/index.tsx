// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../components/Modal';
import * as Style from './styles';

// TYPES
import { IModalCreateCategory } from './utils/types';

// FUNCTIONS
import { schemaCreateCategory, requestCreateCategory } from './utils/functions';

export const ModalCreateCategory = ({
  setModal,
  categories,
  setCategories,
}: IModalCreateCategory) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Criar categoria" setModal={setModal}>
      <Formik
        initialValues={{
          categoryName: '',
        }}
        validationSchema={schemaCreateCategory}
        onSubmit={async (values) => {
          requestCreateCategory({
            values,
            categories,
            setCategories,
            setOnQuery,
            setModal,
          });
        }}
      >
        {({ errors, values, touched }) => (
          <Style.FormContainer>
            <Form>
              <FormikInput
                autoFocus
                maxLength={80}
                label="Nome da categoria"
                name="categoryName"
                value={values.categoryName}
                error={touched.categoryName && errors.categoryName ? errors.categoryName : null}
                placeholder="Digite o nome da categoria"
              />
              <Button center label="Criar" type="submit" loading={onQuery} />
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
