import { useCallback, useEffect, useState } from 'react';

import { getStockItems } from '@services/apis/getStockItems';
import { postStockItem } from '@services/apis/postStockItem';
import { putStockItem } from '@services/apis/putStockItem';
import { deleteStockItem } from '@services/apis/deleteStockItem';

import { Table, TableContent } from '@components/Table';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { IconButton } from '@components/Buttons/IconButton';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import TableCell from '@components/TableCell';

import { handleToastifyMessage } from '@utils/toastifyResponses';

import IconPlus from '@assets/icons/IconPlus';
import IconEdit from '@assets/icons/IconEdit';
import IconTrash from '@assets/icons/IconTrash';

import type { IStockItem, IStockItemForm } from '@customTypes/IStockItem';
import type { IColsBody, IColsHeader } from '@components/Table/types';

import { ModalCreateStockItem } from './components/ModalCreateStockItem';
import { ModalEditStockItem } from './components/ModalEditStockItem';

import * as Style from './styles';

export const StockItems = () => {
  const [stockItems, setStockItems] = useState<IStockItem[]>([]);
  const [stockItemsCount, setStockItemsCount] = useState(0);

  const [selectedStockItemId, setSelectedStockItemId] = useState<string | null>(null);

  const [modalCreateStockItem, setModalCreateStockItem] = useState(false);
  const [modalEditStockItem, setModalEditStockItem] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleModalCreateStockItem = (modalState: boolean) => {
    setModalCreateStockItem(modalState);
  };

  const handleModalEditStockItem = (modalState: boolean) => {
    setModalEditStockItem(modalState);
  };

  const handleGetStockItems = async () => {
    setLoading(true);

    try {
      const responseData = await getStockItems();

      if (responseData) {
        setStockItems(responseData?.stockItems || []);
        setStockItemsCount(responseData?.count || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockItem = async (values: IStockItemForm) => {
    setLoading(true);

    try {
      const responseData = await postStockItem({
        name: values.name,
        description: values.description || '',
        unit: values.unit,
        image: values.image,
        stockItemTypeId: values.stockItemTypeId,
        isActive: values.isActive,
      });

      if (responseData) {
        setStockItems([...stockItems, responseData.stockItem]);
        setStockItemsCount(stockItemsCount + 1);
        handleModalCreateStockItem(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStockItem = async (id: string, values: IStockItemForm) => {
    setLoading(true);

    try {
      const responseData = await putStockItem({
        id,
        name: values.name,
        description: values.description || '',
        unit: values.unit,
        image: values.image,
        stockItemTypeId: values.stockItemTypeId,
        isActive: values.isActive,
      });

      if (responseData) {
        setStockItems(
          stockItems.map((item) =>
            item.id === responseData.stockItem.id
              ? {
                  id: responseData.stockItem.id,
                  name: responseData.stockItem.name,
                  description: responseData.stockItem.description,
                  unit: responseData.stockItem.unit,
                  imageUrl: responseData.stockItem.imageUrl,
                  stockItemType: responseData.stockItem.stockItemType,
                  isActive: responseData.stockItem.isActive,
                }
              : item,
          ),
        );
        handleModalEditStockItem(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderActions = useCallback(
    (stockItem: IStockItem) => {
      const handleDeleteStockItem = async (id: string) => {
        if ((stockItem._count?.stocks || 0) > 0) {
          handleToastifyMessage({
            type: 'warning',
            message: 'Não é possível excluir este item, pois possui estoques associados.',
          });

          return;
        }
        setLoading(true);

        try {
          const responseData = await deleteStockItem({ id });

          if (responseData?.stockItem?.id) {
            setStockItems(stockItems.filter((item) => item.id !== responseData.stockItem.id));
            setStockItemsCount(stockItemsCount - 1);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <Style.ActionsContainer>
          <IconButton
            icon={<IconEdit strokeColor="primary" strokeWidth="1.5" />}
            hideLabelOnMedia
            onClick={() => {
              setSelectedStockItemId(stockItem.id);
              handleModalEditStockItem(true);
            }}
          />

          <PopoverButton
            type="IconButton"
            buttonIcon={<IconTrash strokeColor="primary" />}
            label="Excluir"
            hiddenIconButtonLabel
            message={{
              title: 'Deseja excluir este item?',
              content: 'Atenção, essa ação é irreversível.',
            }}
            fontWeight="400"
            actionButtonClick={() => handleDeleteStockItem(stockItem.id)}
          />
        </Style.ActionsContainer>
      );
    },
    [stockItems, stockItemsCount],
  );

  const colsHeader: IColsHeader[] = [
    { label: 'Item' },
    { label: 'Descrição' },
    { label: 'Tipo' },
    { label: 'Unidade' },
    { label: 'Usado em', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Ações', cssProps: { width: '1%', textAlign: 'center' } },
  ];

  const colsBody: IColsBody<IStockItem>[] = [
    { cell: (item: IStockItem) => item.name },
    { cell: (item: IStockItem) => item.description },
    { cell: (item: IStockItem) => item.stockItemType?.name },
    { cell: (item: IStockItem) => item.unit },
    {
      cell: (item: IStockItem) => item._count?.stocks || 0,
      cssProps: { width: '1%', textAlign: 'center' },
    },
    { cell: renderActions, node: true, cssProps: { width: '1%', textAlign: 'center' } },
  ];

  useEffect(() => {
    handleGetStockItems();
  }, []);

  return (
    <>
      {modalCreateStockItem && (
        <ModalCreateStockItem
          loading={loading}
          onSubmit={handleCreateStockItem}
          onClose={() => handleModalCreateStockItem(false)}
        />
      )}

      {modalEditStockItem && (
        <ModalEditStockItem
          loading={loading}
          stockItem={
            selectedStockItemId !== null
              ? stockItems.find((item) => item.id === selectedStockItemId)
              : undefined
          }
          onEdit={handleEditStockItem}
          onClose={() => handleModalEditStockItem(false)}
        />
      )}

      <Style.Container>
        <Style.Header>
          <Style.HeaderWrapper>
            <h2>Itens</h2>
          </Style.HeaderWrapper>

          <Style.IconsContainer>
            <IconButton
              icon={<IconPlus strokeColor="primary" />}
              label="Adicionar item"
              onClick={() => handleModalCreateStockItem(true)}
            />
          </Style.IconsContainer>
        </Style.Header>

        {loading && <DotSpinLoading />}

        {!loading && stockItems.length === 0 && (
          <Style.NoDataContainer>
            <p>Nenhum item encontrado</p>
          </Style.NoDataContainer>
        )}

        {!loading && stockItems.length > 0 && (
          <Table
            colsHeader={colsHeader}
            pagination
            totalCountOfRegister={stockItemsCount}
            registerPerPage={5}
          >
            {stockItems?.map((item) => (
              <TableContent
                key={item.id}
                colsBody={colsBody.map((col) => ({
                  cell: col.node ? (
                    col.cell(item)
                  ) : (
                    <TableCell value={col.cell(item)?.toString() || ''} type={col.type} />
                  ),
                  cssProps: col.cssProps,
                }))}
              />
            ))}
          </Table>
        )}
      </Style.Container>
    </>
  );
};
