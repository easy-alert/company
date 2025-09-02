// LIBS
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import type { ChangeEvent } from 'react';

// HOOKS
import { useStockItemTypesForSelect } from '@hooks/useStockItemTypesForSelect';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL TYPES
import { IStockItem, IStockItemForm } from '@customTypes/IStockItem';

// STYLES
import { FormikImageInput } from '@components/Form/FormikImageInput';
import * as Style from '../../../styles';

interface IModalEditStockItem {
  loading: boolean;
  stockItem?: IStockItem;
  onEdit: (id: string, values: IStockItemForm) => void;
  onClose: () => void;
}

const updateFailureTypeSchema = yup.object().shape({
  image: yup
    .mixed()
    .test(
      'FileSize',
      'O tamanho da imagem excedeu o limite.',
      (value) => !value || (value && value.size <= 5000000),
    )
    .test(
      'FileType',
      'Formato inválido.',
      (value) =>
        !value ||
        (value &&
          (value.type === 'image/png' ||
            value.type === 'image/jpeg' ||
            value.type === 'image/jpg')),
    ),
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  unit: yup.string().required('Unidade é obrigatória'),
  isActive: yup.boolean().default(true),
});

export const ModalEditStockItem = ({
  loading,
  stockItem,
  onEdit,
  onClose,
}: IModalEditStockItem) => {
  const { stockItemTypesForSelect, loadingStockItemTypesForSelect } = useStockItemTypesForSelect({
    buildingId: '',
  });

  if (!stockItem) return null;

  return (
    <Modal title="Editar um tipo de item" setModal={onClose}>
      {loadingStockItemTypesForSelect ? (
        <DotSpinLoading />
      ) : (
        <Formik<IStockItemForm>
          validationSchema={updateFailureTypeSchema}
          onSubmit={(values) => onEdit(stockItem.id || '', values)}
          initialValues={{
            name: stockItem.name || '',
            description: stockItem.description || '',
            unit: stockItem.unit || '',
            image: stockItem.imageUrl || '',
            stockItemTypeId: stockItem.stockItemType?.id || '',
            isActive: stockItem.isActive || true,
          }}
        >
          {({ errors, values, touched, setFieldValue }) => (
            <Style.ModalFormContainer>
              <Form>
                <FormikImageInput
                  name="image"
                  label="Foto"
                  error={touched.image && errors.image ? errors.image : null}
                  defaultImage={values.image}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      setFieldValue('image', file as File);
                    }
                  }}
                />

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

                <FormikInput
                  name="unit"
                  label="Unidade *"
                  placeholder="Ex: Metros, Unidade, Litros"
                  value={values.unit}
                  error={touched.unit && errors.unit ? errors.unit : null}
                />

                <FormikSelect
                  name="stockItemTypeId"
                  label="Tipo de item *"
                  selectPlaceholderValue="Selecione um tipo de item"
                  value={values.stockItemTypeId}
                  error={
                    touched.stockItemTypeId && errors.stockItemTypeId
                      ? errors.stockItemTypeId
                      : null
                  }
                >
                  <option value="" disabled>
                    Selecione um tipo de item
                  </option>

                  {stockItemTypesForSelect.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </FormikSelect>

                <FormikCheckbox name="isActive" label="Ativo" checked={values.isActive} />

                <Button center label="Atualizar" type="submit" loading={loading} />
              </Form>
            </Style.ModalFormContainer>
          )}
        </Formik>
      )}
    </Modal>
  );
};
