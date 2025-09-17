// LIBS
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

// HOOKS
import { useStockTransfersForSelect } from '@hooks/useStockTransfersForSelect';

// SERVICES
import { getStockById } from '@services/apis/getStockById';
import { postStockMovement } from '@services/apis/postStockMovement';
import { deleteStock } from '@services/apis/deleteStock';

// GLOBAL COMPONENTS
import { StockHistoryActivities } from '@components/StockHistoryActivities';
import { Modal } from '@components/Modal';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { Button } from '@components/Buttons/Button';
import { Image } from '@components/Image';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikTextArea } from '@components/Form/FormikTextArea';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL UTILS
import { formatDateString } from '@utils/dateFunctions';
import { handleTranslate } from '@utils/handleTranslate';

// GLOBAL ASSETS
import IconTrash from '@assets/icons/IconTrash';

// GLOBAL TYPES
import type { IStock } from '@customTypes/IStock';
import type { IStockMovementForm } from '@customTypes/IStockMovements';
import {
  STOCK_MOVEMENT_TYPE_SELECT,
  type TStockMovementTypeSelect,
} from '@customTypes/TStockMovementType';

// STYLES
import * as Style from './styles';

interface IModalStockDetails {
  stockId: string;
  userId?: string;
  onClose: () => void;
  onRefresh?: () => void;
}

const movementStockSchema = yup.object().shape({
  stockId: yup.string().required('ID do estoque é obrigatório'),
  movementType: yup.string().required('Tipo de movimentação é obrigatório'),
  quantity: yup
    .number()
    .required('Quantidade é obrigatória')
    .min(0, 'Quantidade deve ser maior ou igual a 0'),
  transferToId: yup.string().when('movementType', {
    is: 'TRANSFER_OUT',
    then: yup.string().required('Transferência para é obrigatória'),
    otherwise: yup.string(),
  }),
});

export const ModalStockDetails = ({ stockId, userId, onClose, onRefresh }: IModalStockDetails) => {
  const [stock, setStock] = useState<IStock | null>(null);
  const [stockMovementType, setStockMovementType] = useState<TStockMovementTypeSelect | ''>('');

  const { stockTransfersForSelect, loadingStockTransfersForSelect } = useStockTransfersForSelect({
    stockItemId: stock?.stockItem?.id || '',
    enabled: stockMovementType === 'TRANSFER_OUT',
  });

  const [view, setView] = useState<'details' | 'movement'>('details');

  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const isNonCompliant = (stock?.quantity || 0) < (stock?.minimumQuantity || 0);

  const handleViewChange = (viewState: 'details' | 'movement') => {
    setView(viewState);
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleGetStockById = async () => {
    setLoading(true);
    try {
      const responseData = await getStockById({ stockId });

      if (responseData) {
        setStock(responseData.stock);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockMovement = async (values: IStockMovementForm) => {
    setLoading(true);

    try {
      await postStockMovement({
        ...values,
        quantity: values.movementType === 'INCOMING' ? values.quantity : -values.quantity,
      });

      handleRefresh();
      handleViewChange('details');
      onRefresh?.();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (id: string) => {
    setLoading(true);

    try {
      await deleteStock({ id });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onClose();
      onRefresh?.();
    }
  };

  useEffect(() => {
    handleGetStockById();
  }, [refresh]);

  const ticketDetailsRows = [
    {
      label: 'Ativo',
      value: stock?.stockItem?.name,
    },
    {
      label: 'Edificação',
      value: stock?.building?.name,
    },
    {
      label: 'Quantidade',
      value: `${stock?.quantity} ${stock?.stockItem?.unit}`,
    },
    {
      label: 'Tipo',
      value: stock?.stockItem?.stockItemType?.name,
    },
    {
      label: 'Status',
      value: isNonCompliant ? 'NÃO CONFORME' : 'CONFORME',
      color: isNonCompliant ? 'red' : 'green',
    },
    {
      label: 'Qtd. Mínima',
      value: `${stock?.minimumQuantity} ${stock?.stockItem?.unit}`,
    },
  ];

  return (
    <Modal
      title={view === 'details' ? 'Detalhes do estoque' : 'Movimentar estoque'}
      setModal={onClose}
    >
      {loading ? (
        <DotSpinLoading />
      ) : (
        <Style.Container>
          {view === 'details' && (
            <>
              <Style.ImageContainer>
                <Image img={stock?.stockItem?.imageUrl || ''} alt="" size="100px" />
              </Style.ImageContainer>

              <Style.ColumnContainer>
                {ticketDetailsRows.map(({ label, value, color }) => (
                  <Style.ColumnContent key={label}>
                    <Style.RowLabel>{label}</Style.RowLabel>
                    <Style.RowValue color={color} fontWeight={color && 'bold'}>
                      {value}
                    </Style.RowValue>
                  </Style.ColumnContent>
                ))}
              </Style.ColumnContainer>

              <StockHistoryActivities stockId={stockId} userId={userId} />

              <Style.MovementsContainer>
                <h3>Últimas Movimentações (5)</h3>

                {stock?.movements?.map((movement) => (
                  <Style.MovementContent key={movement.id}>
                    <Style.MovementLabel>
                      {movement.movementType === 'TRANSFER_OUT'
                        ? `${handleTranslate({
                            key: movement.movementType || '',
                            capitalize: true,
                          })} para ${movement.transferTo?.name} por ${movement.lastUpdatedBy?.name}`
                        : `${handleTranslate({
                            key: movement.movementType || '',
                            capitalize: true,
                          })} por ${movement.lastUpdatedBy?.name}`}
                    </Style.MovementLabel>
                    <Style.MovementNotes>{movement.notes}</Style.MovementNotes>
                    <Style.MovementValue>
                      {formatDateString(movement.movementDate, 'dd/MM/yyyy - HH:mm')}
                    </Style.MovementValue>
                  </Style.MovementContent>
                ))}
              </Style.MovementsContainer>

              <Style.ButtonContainer>
                <PopoverButton
                  type="Button"
                  label="Excluir"
                  buttonIcon={<IconTrash strokeColor="primary" />}
                  actionButtonBgColor="primary"
                  borderless
                  message={{
                    title: 'Deseja excluir este estoque?',
                    content: 'Atenção, essa ação é irreversível.',
                    contentColor: 'red',
                  }}
                  fontWeight="400"
                  actionButtonClick={() => handleDeleteStock(stockId)}
                />

                <Button
                  label="Movimentar"
                  color="primary"
                  onClick={() => handleViewChange('movement')}
                />
              </Style.ButtonContainer>
            </>
          )}

          {view === 'movement' && (
            <Formik<IStockMovementForm>
              initialValues={{
                stockId,
                movementType: '' as TStockMovementTypeSelect,
                quantity: 0,
                notes: '',
                transferToId: '',
              }}
              validationSchema={movementStockSchema}
              onSubmit={(values) => handleCreateStockMovement(values)}
            >
              {({ errors, values, touched, handleChange, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Style.FormWrapper>
                    <FormikSelect
                      name="movementType"
                      label="Tipo de movimentação"
                      selectPlaceholderValue={' '}
                      value={values.movementType}
                      onChange={(e) => {
                        handleChange(e);
                        setStockMovementType(e.target.value);
                      }}
                      error={
                        touched.movementType && errors.movementType ? errors.movementType : null
                      }
                    >
                      <option value="">Selecione</option>

                      {STOCK_MOVEMENT_TYPE_SELECT.map((smt) => (
                        <option key={smt} value={smt}>
                          {handleTranslate({
                            key: smt,
                            capitalize: true,
                          })}
                        </option>
                      ))}
                    </FormikSelect>

                    <FormikInput
                      name="quantity"
                      label="Quantidade *"
                      placeholder="Ex: 10"
                      type="number"
                      min={0}
                      value={values.quantity}
                      error={touched.quantity && errors.quantity ? errors.quantity : null}
                    />

                    {loadingStockTransfersForSelect && <DotSpinLoading />}

                    {!loadingStockTransfersForSelect &&
                      values.movementType === 'TRANSFER_OUT' &&
                      stockTransfersForSelect.filter(
                        (stockTransfer) => stockTransfer.id !== stockId,
                      ).length > 0 && (
                        <FormikSelect
                          name="transferToId"
                          label="Transferência para"
                          selectPlaceholderValue={' '}
                          value={values.transferToId}
                          onChange={(e) => handleChange(e)}
                          disabled={stockTransfersForSelect.length === 0}
                          error={
                            touched.transferToId && errors.transferToId ? errors.transferToId : null
                          }
                        >
                          <option value="">Selecione</option>

                          {stockTransfersForSelect
                            .filter((stockTransfer) => stockTransfer.id !== stockId)
                            .map((stockTransfer) => (
                              <option key={stockTransfer.id} value={stockTransfer.building.id}>
                                {stockTransfer.building.name} - {stockTransfer.stockItem.name}
                              </option>
                            ))}
                        </FormikSelect>
                      )}

                    {!loadingStockTransfersForSelect &&
                      values.movementType === 'TRANSFER_OUT' &&
                      stockTransfersForSelect.filter(
                        (stockTransfer) => stockTransfer.id !== stockId,
                      ).length === 0 && <p>Nenhuma transferência disponível</p>}

                    <FormikTextArea
                      name="notes"
                      label="Observações"
                      value={values.notes}
                      onChange={(e) => handleChange(e)}
                      error={touched.notes && errors.notes ? errors.notes : null}
                    />
                  </Style.FormWrapper>

                  <Style.ButtonContainer>
                    <Button
                      label="Voltar"
                      textColor="black"
                      borderless
                      onClick={() => handleViewChange('details')}
                    />

                    <PopoverButton
                      type="Button"
                      buttonType="submit"
                      label="Atualizar"
                      buttonIcon={<IconTrash strokeColor="primary" />}
                      actionButtonBgColor="primary"
                      message={{
                        title: 'Deseja atualizar este estoque?',
                        content: 'Atenção, essa ação é irreversível.',
                      }}
                      fontWeight="400"
                      actionButtonClick={handleSubmit}
                    />
                  </Style.ButtonContainer>
                </Form>
              )}
            </Formik>
          )}
        </Style.Container>
      )}
    </Modal>
  );
};
