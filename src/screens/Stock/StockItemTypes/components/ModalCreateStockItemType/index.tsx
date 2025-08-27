// LIBS
import { Form, Formik } from 'formik';
import * as yup from 'yup';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';

// GLOBAL TYPES
import { IStockItemTypeForm } from '@customTypes/IStockItemType';

// STYLES
import * as Style from '../../../styles';

interface IModalCreateStockItemType {
  loading: boolean;
  onSubmit: (values: IStockItemTypeForm) => void;
  onClose: () => void;
}

const createFailureTypeSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  isActive: yup.boolean().default(true),
});

export const ModalCreateStockItemType = ({
  loading,
  onSubmit,
  onClose,
}: IModalCreateStockItemType) => (
  <Modal title="Criar um tipo de item" setModal={onClose}>
    <Formik<IStockItemTypeForm>
      validationSchema={createFailureTypeSchema}
      onSubmit={(values) => onSubmit(values)}
      initialValues={{
        name: '',
        description: '',
        isActive: true,
      }}
    >
      {({ errors, values, touched }) => (
        <Style.ModalFormContainer>
          <Form>
            <FormikInput
              name="name"
              label="Nome *"
              placeholder="Ex: Tipo de item"
              value={values.name}
              error={touched.name && errors.name ? errors.name : null}
            />

            <FormikInput
              name="description"
              label="Descrição"
              placeholder="Ex: Descrição do tipo de item"
              value={values.description}
              error={touched.description && errors.description ? errors.description : null}
            />

            <Button center label="Criar" type="submit" loading={loading} />
          </Form>
        </Style.ModalFormContainer>
      )}
    </Formik>
  </Modal>
);
