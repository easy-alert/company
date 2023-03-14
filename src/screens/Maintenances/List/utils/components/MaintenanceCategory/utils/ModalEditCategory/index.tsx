// LIBS
import { useState } from 'react';
import { Form, Formik } from 'formik';

// COMPONENTS
import { Button } from '../../../../../../../../components/Buttons/Button';
import { FormikInput } from '../../../../../../../../components/Form/FormikInput';
import { Modal } from '../../../../../../../../components/Modal';
import { PopoverButton } from '../../../../../../../../components/Buttons/PopoverButton';

// STYLES
import * as Style from './styles';
import { theme } from '../../../../../../../../styles/theme';

// TYPES
import { IModalCreateMaintenance } from './utils/types';

// FUNCTIONS
import { schemaEditCategory, requestEditCategory, requestDeleteCategory } from './utils/functions';

export const ModalEditCategory = ({
  categoryId,
  categories,
  setCategories,
  categoryName,
  setModal,
}: IModalCreateMaintenance) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Modal title="Editar categoria" setModal={setModal}>
      <Formik
        initialValues={{
          categoryName,
        }}
        validationSchema={schemaEditCategory}
        onSubmit={async (values) => {
          requestEditCategory({
            categoryId,
            categories,
            setCategories,
            values,
            setModal,
            setOnQuery,
          });
        }}
      >
        {({ errors, values, touched }) => (
          <Style.FormContainer>
            <Form>
              <FormikInput
                maxLength={80}
                autoFocus
                label="Nome da categoria"
                name="categoryName"
                value={values.categoryName}
                error={touched.categoryName && errors.categoryName ? errors.categoryName : null}
                placeholder=" "
              />
              <Style.ButtonContainer>
                {!onQuery && (
                  <PopoverButton
                    actionButtonBgColor={theme.color.actionDanger}
                    borderless
                    type="Button"
                    label="Excluir"
                    message={{
                      title: 'Deseja excluir esta categoria?',
                      content:
                        'Atenção, todas as manutenções dentro dessa categoria também serão excluídas. Essa ação não poderá ser desfeita posteriormente.',
                      contentColor: theme.color.danger,
                    }}
                    actionButtonClick={() => {
                      requestDeleteCategory({
                        categoryId,
                        categories,
                        setCategories,
                        setOnQuery,
                      });
                    }}
                  />
                )}
                <Button label="Salvar" type="submit" loading={onQuery} />
              </Style.ButtonContainer>
            </Form>
          </Style.FormContainer>
        )}
      </Formik>
    </Modal>
  );
};
