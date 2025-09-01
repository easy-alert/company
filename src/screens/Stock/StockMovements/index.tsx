// REACT
import { useEffect, useState } from 'react';

// SERVICES
import { getStockMovements } from '@services/apis/getStockMovements';

// GLOBAL COMPONENTS
import { Table, TableContent } from '@components/Table';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import TableCell from '@components/TableCell';

// GLOBAL UTILS
import { handleTranslate } from '@utils/handleTranslate';

// GLOBAL TYPES
import type { IStockMovement } from '@customTypes/IStockMovements';
import type { IColsBody, IColsHeader } from '@components/Table/types';

// STYLES
import * as Style from './styles';

export const StockMovements = () => {
  const [stockMovements, setStockMovements] = useState<IStockMovement[]>([]);
  const [stockMovementsCount, setStockMovementsCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleGetStockMovements = async () => {
    setLoading(true);

    try {
      const responseData = await getStockMovements();

      if (responseData) {
        setStockMovements(responseData?.stockMovements || []);
        setStockMovementsCount(responseData?.count || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const colsHeader: IColsHeader[] = [
    { label: 'Tipo' },
    { label: 'Item' },
    { label: 'Edificação' },
    { label: 'Transferência para' },
    { label: 'Última atualização' },
    { label: 'Notas' },
    { label: 'Anterior', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Quantidade', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Novo', cssProps: { width: '1%', textAlign: 'center' } },
    { label: 'Data', cssProps: { width: '1%', textAlign: 'center' } },
  ];

  const colsBody: IColsBody<IStockMovement>[] = [
    {
      cell: (item: IStockMovement) =>
        handleTranslate({ key: item.movementType || '', capitalize: true }),
    },
    {
      cell: (item: IStockMovement) => item.stockItem?.name,
    },
    {
      cell: (item: IStockMovement) => item.stock?.building?.name,
    },
    {
      cell: (item: IStockMovement) => item.transferTo?.name,
    },
    {
      cell: (item: IStockMovement) => item.lastUpdatedBy?.name,
    },
    {
      cell: (item: IStockMovement) => item.notes,
    },
    {
      cell: (item: IStockMovement) => item.previousBalance,
      cssProps: { textAlign: 'center' },
    },
    {
      cell: (item: IStockMovement) => item.quantity,
      cssProps: { textAlign: 'center' },
    },
    {
      cell: (item: IStockMovement) => item.newBalance,
      cssProps: { textAlign: 'center' },
    },
    {
      cell: (item: IStockMovement) => item.movementDate,
      type: 'datetime',
      cssProps: { textAlign: 'center' },
    },
  ];

  useEffect(() => {
    handleGetStockMovements();
  }, []);

  return (
    <Style.Container>
      <Style.Header>
        <Style.HeaderWrapper>
          <h2>Tipos de itens</h2>
        </Style.HeaderWrapper>
      </Style.Header>

      {loading && <DotSpinLoading />}

      {!loading && stockMovements.length === 0 && (
        <Style.NoDataContainer>
          <p>Nenhuma movimentação encontrada</p>
        </Style.NoDataContainer>
      )}

      {!loading && stockMovements.length > 0 && (
        <Table
          colsHeader={colsHeader}
          pagination
          totalCountOfRegister={stockMovementsCount}
          registerPerPage={10}
        >
          {stockMovements?.map((item) => (
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
  );
};
