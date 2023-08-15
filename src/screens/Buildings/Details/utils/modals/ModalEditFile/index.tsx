// COMPONENTS
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Modal } from '../../../../../../components/Modal';

// STYLES
import * as Style from './styles';

// FUNCTIONS
import { FormikInput } from '../../../../../../components/Form/FormikInput';
import { Button } from '../../../../../../components/Buttons/Button';
import { IModalEditFile } from './types';
import { schemaEditFile, requestEditFile } from './functions';

export const ModalEditFile = ({ setBuilding, setModal, file }: IModalEditFile) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const initialValues: { name: string } = {
    name: file.name,
  };

  return (
    <Modal title="Editar arquivo" setModal={setModal}>
      <Style.Container>
        <Formik
          initialValues={initialValues}
          validationSchema={schemaEditFile}
          onSubmit={async (values) => {
            await requestEditFile({
              name: values.name,
              setModal,
              setOnQuery,
              setBuilding,
              fileId: file.id,
            });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <FormikInput
                autoFocus
                label="Nome do arquivo"
                placeholder="Informe o nome do arquivo"
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
