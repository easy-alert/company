// LIBS
import { Form, Formik } from 'formik';
import * as yup from 'yup';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';

// GLOBAL TYPES
import { IStockItemType, IStockItemTypeForm } from '@customTypes/IStockItemType';

// STYLES
import * as Style from '../../../styles';

interface IModalEditStockItemType {
  loading: boolean;
  stockItemType?: IStockItemType;
  onEdit: (id: string, values: IStockItemTypeForm) => void;
  onClose: () => void;
}

const updateFailureTypeSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  isActive: yup.boolean().default(true),
});

export const ModalEditStockItemType = ({
  loading,
  stockItemType,
  onEdit,
  onClose,
}: IModalEditStockItemType) => {
  if (!stockItemType) return null;

  return (
    <Modal title="Editar um tipo de item" setModal={onClose}>
      <Formik<IStockItemTypeForm>
        validationSchema={updateFailureTypeSchema}
        onSubmit={(values) => onEdit(stockItemType.id || '', values)}
        initialValues={{
          name: stockItemType.name || '',
          description: stockItemType.description || '',
          isActive: stockItemType.isActive || true,
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

              <FormikCheckbox name="isActive" label="Ativo" checked={values.isActive} />

              <Button center label="Atualizar" type="submit" loading={loading} bgColor="primary " />
            </Form>
          </Style.ModalFormContainer>
        )}
      </Formik>
    </Modal>
  );
};
