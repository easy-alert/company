// LIBS
import { useEffect, useState } from 'react';

// SERVICES
import { getStockById } from '@services/apis/getStockById';
import { deleteStock } from '@services/apis/deleteStock';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL UTILS
import { formatDateString } from '@utils/dateFunctions';
import { handleTranslate } from '@utils/handleTranslate';

// GLOBAL ASSETS
import IconTrash from '@assets/icons/IconTrash';

// GLOBAL TYPES
import { IStock } from '@customTypes/IStock';

// STYLES
import * as Style from './styles';

interface IModalStockDetails {
  stockId: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export const ModalStockDetails = ({ stockId, onClose, onRefresh }: IModalStockDetails) => {
  const [stock, setStock] = useState<IStock | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isNonCompliant = (stock?.quantity || 0) < (stock?.minimumQuantity || 0);

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
  }, []);

  return (
    <Modal title="Detalhes do estoque" bodyWidth="600px" setModal={onClose}>
      {loading ? (
        <DotSpinLoading />
      ) : (
        <Style.Container>
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

          <Style.MovementsContainer>
            <h2>Movimentações</h2>

            {stock?.movements?.map((movement) => (
              <Style.MovementContent key={movement.id}>
                <Style.MovementLabel>
                  {movement.movementType === 'TRANSFER_IN' ||
                  movement.movementType === 'TRANSFER_OUT'
                    ? `${handleTranslate({
                        key: movement.movementType || '',
                        capitalize: true,
                      })} para ${movement.transferTo?.name} por ${movement.lastUpdatedBy?.name}`
                    : `${handleTranslate({
                        key: movement.movementType || '',
                        capitalize: true,
                      })} por ${movement.lastUpdatedBy?.name}`}
                </Style.MovementLabel>
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
          </Style.ButtonContainer>
        </Style.Container>
      )}
    </Modal>
  );
};
