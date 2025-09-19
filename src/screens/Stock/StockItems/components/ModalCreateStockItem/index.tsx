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
import { FormikImageInput } from '@components/Form/FormikImageInput';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL TYPES
import type { IStockItemForm } from '@customTypes/IStockItem';

// STYLES
import * as Style from '../../../styles';

interface IModalCreateStockItem {
  loading: boolean;
  onSubmit: (values: IStockItemForm) => void;
  onClose: () => void;
}

const createStockItemSchema = yup.object().shape({
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
  stockItemTypeId: yup.string().required('Tipo de item é obrigatório'),
  isActive: yup.boolean().default(true),
});

export const ModalCreateStockItem = ({ loading, onSubmit, onClose }: IModalCreateStockItem) => {
  const { stockItemTypesForSelect, loadingStockItemTypesForSelect } = useStockItemTypesForSelect({
    buildingId: '',
  });

  return (
    <Modal title="Criar um item" setModal={onClose}>
      {loadingStockItemTypesForSelect ? (
        <DotSpinLoading />
      ) : (
        <Formik<IStockItemForm>
          validationSchema={createStockItemSchema}
          onSubmit={(values) => onSubmit(values)}
          initialValues={{
            image: null,
            name: '',
            description: '',
            unit: '',
            stockItemTypeId: '',
            isActive: true,
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
                  placeholder="Ex: Item"
                  value={values.name}
                  error={touched.name && errors.name ? errors.name : null}
                />

                <FormikInput
                  name="description"
                  label="Descrição"
                  placeholder="Ex: Descrição do item"
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

                <Button center label="Criar" type="submit" loading={loading} bgColor="primary" />
              </Form>
            </Style.ModalFormContainer>
          )}
        </Formik>
      )}
    </Modal>
  );
};
