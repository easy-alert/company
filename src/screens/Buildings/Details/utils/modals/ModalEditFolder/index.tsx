// COMPONENTS
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Modal } from '../../../../../../components/Modal';

// STYLES
import * as Style from './styles';

// FUNCTIONS
import { IModalEditFolder } from './types';
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { requestEditFolder, schemaEditFolder } from './functions';
import { Button } from '../../../../../../components/Buttons/Button';

export const ModalEditFolder = ({ setBuilding, setModal, folder }: IModalEditFolder) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const initialValues: { name: string } = {
    name: folder.name,
  };

  return (
    <Modal title="Editar pasta" setModal={setModal}>
      <Style.Container>
        <Formik
          initialValues={initialValues}
          validationSchema={schemaEditFolder}
          onSubmit={async (values) => {
            await requestEditFolder({
              name: values.name,
              setModal,
              setOnQuery,
              setBuilding,
              folderId: folder.id,
            });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <FormikInput
                maxLength={100}
                autoFocus
                label="Nome da pasta"
                placeholder="Informe o nome da pasta"
                name="name"
                error={touched.name && (errors.name || null)}
              />
              <Button label="Salvar" type="submit" center loading={onQuery} />
            </Form>
          )}
        </Formik>
      </Style.Container>
    </Modal>
  );
};
