// REACT
import { useEffect, useState, useCallback } from 'react';

// LIBS
import type { CSSProperties } from 'styled-components';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { getNiboBills } from '@services/nibo/getNiboBills';
import { getNiboReceipts } from '@services/nibo/getNiboReceipts';

// GLOBAL COMPONENTS
import { Table, TableContent } from '@components/Table';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { IconButton } from '@components/Buttons/IconButton';
import TableCell from '@components/TableCell';

// GLOBAL UTILS
import { formatDate } from '@utils/dateFunctions';
import { handleTranslate } from '@utils/handleTranslate';
import { handleToastifyMessage } from '@utils/toastifyResponses';

// GLOBAL ASSETS
import IconDownload from '@assets/icons/IconDownload';

// CUSTOM TYPES
import type { IBill } from '@customTypes/nibo/IBill';
import type { IColsBody, IColsHeader } from '@components/Table/types';

// STYLES
import * as Style from './styles';

export const Bills = () => {
  const {
    account: {
      Company: { CPF, CNPJ, linkedExternalForPayment },
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
              message: 'NF não encontrada',
              type: 'warning',
            });

            return;
          }

          e.stopPropagation();
          window.open(pdfFileUrl, '_blank');
        } catch (error) {
          handleToastifyMessage({
            message: 'Erro ao abrir NF',
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
            label="NF"
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

    let countData = 0;
    let billsData: IBill[] = [];

    try {
      const responseData = await getNiboBills({
        filter: `originSchedule/stakeholder/cpfCnpj eq '${CPF || CNPJ}'`,
      });

      billsData = [...billsData, ...(responseData?.items || [])];
      countData = responseData?.count || 0;

      await Promise.all(
        linkedExternalForPayment.map(async (externalId) => {
          const data = await getNiboBills({
            filter: `originSchedule/stakeholder/cpfCnpj eq '${externalId}'`,
          });

          if (!data) {
            return;
          }

          billsData = [...billsData, ...(data?.items || [])];
          countData = data?.count || 0;
        }),
      );

      setBills(
        billsData.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()),
      );
      setBillsCount(countData);
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
      label: 'Nome',
    },
    {
      label: 'CPF/CNPJ',
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

  const colsBody: IColsBody<IBill>[] = [
    {
      cell: (item: IBill) => item.originSchedule.description,
      type: 'string',
    },
    {
      cell: (item: IBill) => item.originSchedule.stakeholder.cpfCnpj,
      type: 'cpfCnpj',
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
      cell: (item: IBill) =>
        handleTranslate({ key: item.statusDescription, capitalize: true, alternative: true }),
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
        <Style.NoDataContainer>
          <p>Nenhuma conta encontrada</p>
        </Style.NoDataContainer>
      )}

      {!loading && bills.length > 0 && (
        <Table
          colsHeader={colsHeader}
          pagination
          totalCountOfRegister={billsCount}
          registerPerPage={5}
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
