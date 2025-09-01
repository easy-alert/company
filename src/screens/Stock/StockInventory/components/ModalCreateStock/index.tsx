// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';
import { useStockItemsForSelect } from '@hooks/useStockItemsForSelect';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikTextArea } from '@components/Form/FormikTextArea';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL TYPES
import { IStockForm } from '@customTypes/IStock';

// STYLES
import * as Style from '../../../styles';

interface IModalCreateStock {
  loading: boolean;
  onSubmit: (values: IStockForm) => void;
  onClose: () => void;
}

const createStockItemSchema = yup.object().shape({
  buildingId: yup.string().required('Edificação é obrigatória'),
  quantity: yup
    .number()
    .required('Quantidade é obrigatória')
    .min(0, 'Quantidade deve ser maior ou igual a 0'),
  minimumQuantity: yup
    .number()
    .required('Quantidade mínima é obrigatória')
    .min(0, 'Quantidade mínima deve ser maior ou igual a 0'),
  location: yup.string(),
  notes: yup.string(),
  stockItemId: yup.string().required('Item é obrigatório'),
  isActive: yup.boolean().default(true),
});

export const ModalCreateStock = ({ loading, onSubmit, onClose }: IModalCreateStock) => {
  const { buildingsForSelect, loadingBuildingsForSelect } = useBuildingsForSelect({
    checkPerms: false,
  });

  const [buildingId, setBuildingId] = useState('');

  const { stockItemsForSelect, loadingStockItemsForSelect } = useStockItemsForSelect({
    buildingId,
  });

  return (
    <Modal title="Criar um item" setModal={onClose}>
      {loadingStockItemsForSelect && loadingBuildingsForSelect ? (
        <DotSpinLoading />
      ) : (
        <Formik<IStockForm>
          validationSchema={createStockItemSchema}
          onSubmit={(values) => onSubmit(values)}
          initialValues={{
            buildingId: '',
            quantity: 0,
            minimumQuantity: 0,
            location: '',
            notes: '',
            stockItemId: '',
            isActive: true,
          }}
        >
          {({ errors, values, touched, handleChange }) => (
            <Style.ModalFormContainer>
              <Form>
                <FormikSelect
                  name="buildingId"
                  label="Edificação *"
                  selectPlaceholderValue="Selecione uma edificação"
                  value={values.buildingId}
                  error={touched.buildingId && errors.buildingId ? errors.buildingId : null}
                  onChange={(e) => {
                    handleChange(e);
                    setBuildingId(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Selecione uma edificação
                  </option>

                  {buildingsForSelect.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </FormikSelect>

                <FormikSelect
                  name="stockItemId"
                  label="Item *"
                  selectPlaceholderValue="Selecione um item"
                  value={values.stockItemId}
                  error={touched.stockItemId && errors.stockItemId ? errors.stockItemId : null}
                >
                  <option value="" disabled>
                    Selecione um item
                  </option>

                  {stockItemsForSelect.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </FormikSelect>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <FormikInput
                    name="quantity"
                    label="Quantidade *"
                    placeholder="Ex: 10"
                    type="number"
                    min={0}
                    value={values.quantity}
                    error={touched.quantity && errors.quantity ? errors.quantity : null}
                  />

                  <FormikInput
                    name="minimumQuantity"
                    label="Quantidade mínima *"
                    placeholder="Ex: 10"
                    type="number"
                    min={0}
                    value={values.minimumQuantity}
                    error={
                      touched.minimumQuantity && errors.minimumQuantity
                        ? errors.minimumQuantity
                        : null
                    }
                  />
                </div>

                <FormikTextArea
                  name="notes"
                  label="Observações"
                  placeholder="Ex: Observações"
                  value={values.notes}
                  error={touched.notes && errors.notes ? errors.notes : null}
                />

                <Button center label="Criar" type="submit" loading={loading} />
              </Form>
            </Style.ModalFormContainer>
          )}
        </Formik>
      )}
    </Modal>
  );
};
