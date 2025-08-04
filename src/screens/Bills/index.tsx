import { useEffect, useState, useCallback } from 'react';
import { getNiboBills } from '@services/nibo/getNiboBills';
import { Table, TableContent } from '@components/Table';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import type { IBill } from '@customTypes/nibo/IBill';
import TableCell, { type TTableCellType } from '@components/TableCell';
import { handleTranslate } from '@utils/handleTranslate';
import { CSSProperties } from 'styled-components';
import { formatDate } from '@utils/dateFunctions';
import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { NoDataContainer } from '@screens/Tickets/styles';
import IconEye from '@assets/icons/IconEye';
import { IconButton } from '@components/Buttons/IconButton';
import { getNiboReceipts } from '@services/nibo/getNiboReceipts';
import { handleToastifyMessage } from '@utils/toastifyResponses';
import IconDownload from '@assets/icons/IconDownload';
import * as Style from './styles';

interface IColsHeader {
  label: string;
  cssProps?: CSSProperties;
}

interface IColsBody {
  cell: (item: IBill) => string | number | React.ReactNode;
  type?: TTableCellType;
  node?: boolean;
  cssProps?: CSSProperties;
}

export const Bills = () => {
  const {
    account: {
      Company: { CPF, CNPJ },
    },
  } = useAuthContext();

  const [bills, setBills] = useState<IBill[]>([]);
  const [billsCount, setBillsCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const renderActions = useCallback(
    (originScheduleId: string, billUrl: string, statusDescription: string) => {
      const handleOpenBill = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(billUrl, '_blank');
      };

      const handleOpenReceipt = async (e: React.MouseEvent) => {
        try {
          const responseData = await getNiboReceipts({
            filter: `schedule/id eq ${originScheduleId}`,
          });

          const pdfFileUrl = responseData?.items[0].pdfFileUrl;

          if (!pdfFileUrl) {
            handleToastifyMessage({
              message: 'Recibo não encontrado',
              type: 'warning',
            });

            return;
          }

          e.stopPropagation();
          window.open(pdfFileUrl, '_blank');
        } catch (error) {
          handleToastifyMessage({
            message: 'Erro ao abrir recibo',
            type: 'error',
          });
        }
      };

      return (
        <Style.ActionsContainer>
          <IconButton
            label="Boleto"
            icon={<IconDownload strokeColor="primary" />}
            hideLabelOnMedia
            onClick={handleOpenBill}
            disabled={billUrl === ''}
          />

          <IconButton
            label="Recibo"
            hideLabelOnMedia
            icon={<IconDownload strokeColor="primary" />}
            onClick={handleOpenReceipt}
            disabled={statusDescription !== 'Paid'}
          />
        </Style.ActionsContainer>
      );
    },
    [],
  );

  const handleGetNiboBills = async () => {
    setLoading(true);

    try {
      const responseData = await getNiboBills({
        filter: `startswith(originSchedule/stakeholder/cpfCnpj, '${CPF || CNPJ}')`,
      });

      setBills(responseData?.items || []);
      setBillsCount(responseData?.count || 0);
    } catch (error) {
      handleToastifyMessage({
        message: 'Erro ao buscar contas',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetNiboBills();
  }, []);

  const colsHeader: IColsHeader[] = [
    {
      label: 'Nº',
    },
    {
      label: 'Data de vencimento',
      cssProps: {
        width: 'fit-content',
        textAlign: 'center',
      },
    },
    {
      label: 'Data de pagamento',
      cssProps: {
        width: 'fit-content',
        textAlign: 'center',
      },
    },

    {
      label: 'Valor',
      cssProps: {
        width: '150px',
        textAlign: 'center',
      },
    },
    {
      label: 'Status',
      cssProps: {
        width: 'fit-content',
        textAlign: 'center',
      },
    },
    {
      label: 'Ações',
      cssProps: {
        width: '1%',
        textAlign: 'center',
      },
    },
  ];

  const colsBody: IColsBody[] = [
    {
      cell: (item: IBill) => item.id,
      type: 'string',
    },
    {
      cell: (item: IBill) => formatDate(item.dueDate),
      type: 'string',
      cssProps: {
        width: '1%',
        textAlign: 'center',
      },
    },
    {
      cell: (item: IBill) => (item.paidAt ? formatDate(item.paidAt) : ''),
      type: 'string',
      cssProps: {
        width: '1%',
        textAlign: 'center',
      },
    },
    {
      cell: (item: IBill) => item.value,
      type: 'currencyNibo',
      cssProps: {
        width: '150px',
        textAlign: 'center',
      },
    },
    {
      cell: (item: IBill) => handleTranslate(item.statusDescription, true),
      type: 'string',
      cssProps: {
        width: '150px',
        textAlign: 'center',
      },
    },
    {
      cell: (item: IBill) => renderActions(item.originScheduleId, item.url, item.statusDescription),
      node: true,
      cssProps: {
        width: 'fit-content',
        textAlign: 'center',
      },
    },
  ];

  return (
    <Style.Container>
      <Style.Header>
        <Style.HeaderWrapper>
          <h2>Contas</h2>
        </Style.HeaderWrapper>
      </Style.Header>

      {loading && <DotSpinLoading />}

      {!loading && bills.length === 0 && (
        <NoDataContainer>
          <p>Nenhuma conta encontrada</p>
        </NoDataContainer>
      )}

      {!loading && bills.length > 0 && (
        <Table
          colsHeader={colsHeader}
          pagination
          totalCountOfRegister={billsCount}
          registerPerPage={10}
        >
          {bills?.map((item) => (
            <TableContent
              key={item.id}
              onClick={() => {
                // TODO: Implementar a funcionalidade de abrir a conta
              }}
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
