// COMPONENTS
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Modal } from '../../../../../../components/Modal';

// STYLES
import * as Style from './styles';

// FUNCTIONS
import { IModalCreateFolder } from './types';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { requestCreateFolder, schemaCreateFolder } from './functions';
import { Button } from '../../../../../../components/Buttons/Button';

export const ModalCreateFolder = ({
  setModal,
  buildingId,
  setBuilding,
  parentId,
}: IModalCreateFolder) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const initialValues: { name: string } = {
    name: '',
  };

  return (
    <Modal title="Criar pasta" setModal={setModal}>
      <Style.Container>
        <Formik
          initialValues={initialValues}
          validationSchema={schemaCreateFolder}
          onSubmit={async (values) => {
            await requestCreateFolder({
              name: values.name,
              setModal,
              setOnQuery,
              buildingId,
              setBuilding,
              parentId,
            });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <FormikInput
                autoFocus
                label="Nome da pasta"
                placeholder="Informe o nome da pasta"
                name="name"
                error={touched.name && (errors.name || null)}
              />
              <Button label="Criar" type="submit" center loading={onQuery} />
            </Form>
          )}
        </Formik>
      </Style.Container>
    </Modal>
  );
};
