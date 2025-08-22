import { useCallback, useEffect, useState } from 'react';

import { getStockItemTypes } from '@services/apis/getStockItemTypes';
import { postStockItemTypes } from '@services/apis/postStockItemTypes';
import { putStockItemTypes } from '@services/apis/putStockItemTypes';
import { deleteStockItemType } from '@services/apis/deleteStockItemType';

import { Table, TableContent } from '@components/Table';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { IconButton } from '@components/Buttons/IconButton';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import TableCell from '@components/TableCell';

import IconPlus from '@assets/icons/IconPlus';
import IconEdit from '@assets/icons/IconEdit';
import IconTrash from '@assets/icons/IconTrash';

import type { IStockItemType, IStockItemTypeForm } from '@customTypes/IStockItemType';
import type { IColsBody, IColsHeader } from '@components/Table/types';

import { ModalCreateStockItemType } from './components/ModalCreateStockItemType';
import { ModalEditStockItemType } from './components/ModalEditStockItemType';

import * as Style from './styles';

export const StockItemTypes = () => {
  const [stockItemTypes, setStockItemTypes] = useState<IStockItemType[]>([]);
  const [stockItemTypesCount, setStockItemTypesCount] = useState(0);

  const [selectedStockItemTypeId, setSelectedStockItemTypeId] = useState<string | null>(null);

  const [modalCreateStockItemType, setModalCreateStockItemType] = useState(false);
  const [modalEditStockItemType, setModalEditStockItemType] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleModalCreateStockItemType = (modalState: boolean) => {
    setModalCreateStockItemType(modalState);
  };

  const handleModalEditStockItemType = (modalState: boolean) => {
    setModalEditStockItemType(modalState);
  };

  const handleGetStockItemTypes = async () => {
    setLoading(true);

    try {
      const responseData = await getStockItemTypes();

      if (responseData) {
        setStockItemTypes(responseData?.stockItemTypes || []);
        setStockItemTypesCount(responseData?.count || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockItemType = async (values: IStockItemTypeForm) => {
    setLoading(true);

    try {
      const responseData = await postStockItemTypes({
        name: values.name,
        description: values.description || '',
        isActive: values.isActive,
      });

      if (responseData) {
        setStockItemTypes([...stockItemTypes, responseData.stockItemType]);
        setStockItemTypesCount(stockItemTypesCount + 1);
        handleModalCreateStockItemType(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStockItemType = async (id: string, values: IStockItemTypeForm) => {
    setLoading(true);

    try {
      const responseData = await putStockItemTypes({
        id,
        name: values.name,
        description: values.description || '',
        isActive: values.isActive,
      });

      if (responseData) {
        setStockItemTypes(
          stockItemTypes.map((item) =>
            item.id === responseData.stockItemType.id
              ? {
                  id: responseData.stockItemType.id,
                  name: responseData.stockItemType.name,
                  description: responseData.stockItemType.description,
                  isActive: responseData.stockItemType.isActive,
                }
              : item,
          ),
        );
        handleModalEditStockItemType(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderActions = useCallback(
    (stockItemType: IStockItemType) => {
      const handleDeleteStockItemType = async (id: string) => {
        setLoading(true);

        try {
          const responseData = await deleteStockItemType({ id });

          if (responseData?.stockItemType?.id) {
            setStockItemTypes(
              stockItemTypes.filter((item) => item.id !== responseData.stockItemType.id),
            );
            setStockItemTypesCount(stockItemTypesCount - 1);
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
              setSelectedStockItemTypeId(stockItemType.id);
              handleModalEditStockItemType(true);
            }}
          />

          <PopoverButton
            type="IconButton"
            buttonIcon={<IconTrash strokeColor="primary" />}
            label="Excluir"
            hiddenIconButtonLabel
            message={{
              title: 'Deseja excluir este tipo de item?',
              content: 'Atenção, essa ação é irreversível.',
            }}
            fontWeight="400"
            actionButtonClick={() => handleDeleteStockItemType(stockItemType.id)}
          />
        </Style.ActionsContainer>
      );
    },
    [stockItemTypes, stockItemTypesCount],
  );

  const colsHeader: IColsHeader[] = [
    { label: 'Item' },
    { label: 'Descrição' },
    { label: 'Usado em', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Ações', cssProps: { width: '1%', textAlign: 'center' } },
  ];

  const colsBody: IColsBody<IStockItemType>[] = [
    { cell: (item: IStockItemType) => item.name },
    { cell: (item: IStockItemType) => item.description },
    {
      cell: (item: IStockItemType) => item._count?.stockItems,
      cssProps: { width: '1%', textAlign: 'center' },
    },
    { cell: renderActions, node: true, cssProps: { width: '1%', textAlign: 'center' } },
  ];

  useEffect(() => {
    handleGetStockItemTypes();
  }, []);

  return (
    <>
      {modalCreateStockItemType && (
        <ModalCreateStockItemType
          loading={loading}
          onSubmit={handleCreateStockItemType}
          onClose={() => handleModalCreateStockItemType(false)}
        />
      )}

      {modalEditStockItemType && (
        <ModalEditStockItemType
          loading={loading}
          stockItemType={
            selectedStockItemTypeId !== null
              ? stockItemTypes.find((item) => item.id === selectedStockItemTypeId)
              : undefined
          }
          onEdit={handleEditStockItemType}
          onClose={() => handleModalEditStockItemType(false)}
        />
      )}

      <Style.Container>
        <Style.Header>
          <Style.HeaderWrapper>
            <h2>Tipos de itens</h2>
          </Style.HeaderWrapper>

          <Style.IconsContainer>
            <IconButton
              icon={<IconPlus strokeColor="primary" />}
              label="Adicionar tipo de item"
              onClick={() => handleModalCreateStockItemType(true)}
            />
          </Style.IconsContainer>
        </Style.Header>

        {loading && <DotSpinLoading />}

        {!loading && stockItemTypes.length === 0 && (
          <Style.NoDataContainer>
            <p>Nenhum tipo de item encontrado</p>
          </Style.NoDataContainer>
        )}

        {!loading && stockItemTypes.length > 0 && (
          <Table
            colsHeader={colsHeader}
            pagination
            totalCountOfRegister={stockItemTypesCount}
            registerPerPage={5}
          >
            {stockItemTypes?.map((item) => (
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
