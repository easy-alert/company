// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { EventTag } from '@components/EventTag';
import { InProgressTag } from '@components/InProgressTag';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';

// UTILS
import { dateFormatter, applyMask } from '@utils/functions';

// GLOBAL TYPES
import { TModalNames } from '@customTypes/TModalNames';

// COMPONENTS
import {
  ReportDataTable,
  ReportDataTableContent,
} from '../../../Reports/Maintenances/ReportDataTable';

// STYLES
import { TagContainer } from '../../../Reports/Maintenances/styles';

// TYPES
import type { ISupplierMaintenanceHistory } from './types';

export const SupplierMaintenanceHistory = ({
  maintenancesHistory,
  getMaintenanceHistory,
}: ISupplierMaintenanceHistory) => {
  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');

  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState<boolean>(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<boolean>(false);

  const handleModals = (modal: TModalNames, modalState: boolean) => {
    switch (modal) {
      case 'modalCreateOccasionalMaintenance':
        setModalMaintenanceReportSend(modalState);
        break;
      case 'modalMaintenanceDetails':
        setModalMaintenanceDetails(modalState);
        break;

      default:
        break;
    }
  };

  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  return (
    <>
      {modalMaintenanceDetails && (
        <ModalMaintenanceDetails
          modalAdditionalInformations={{
            id: maintenanceHistoryId,
          }}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      {modalMaintenanceReportSend && (
        <ModalMaintenanceReportSend
          maintenanceHistoryId={maintenanceHistoryId}
          refresh={refresh}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      {/* {modalEditReport && maintenanceHistoryId && (
        <ModalEditMaintenanceReport
          handleModalEditReport={handleModalEditReport}
          maintenanceHistoryId={maintenanceHistoryId}
          onThenActionRequest={async () => {
            getMaintenanceHistory();
          }}
        />
      )} */}

      {maintenancesHistory.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ marginBottom: '12px' }}>Histórico de manutenções</h2>

          <ReportDataTable
            colsHeader={[
              { label: 'Status' },
              { label: 'Edificação' },
              { label: 'Categoria' },
              { label: 'Elemento' },
              { label: 'Atividade' },
              { label: 'Responsável' },
              { label: 'Data de notificação' },
              { label: 'Data de vencimento' },
              { label: 'Valor' },
            ]}
          >
            {maintenancesHistory?.map((maintenanceHistory) => (
              <ReportDataTableContent
                key={maintenanceHistory.id}
                colsBody={[
                  {
                    cell: (
                      <TagContainer>
                        {maintenanceHistory.status === 'overdue' && <EventTag status="completed" />}
                        <EventTag status={maintenanceHistory.status} />
                        {maintenanceHistory.type === 'occasional' ? (
                          <EventTag status="occasional" />
                        ) : (
                          <EventTag status="common" />
                        )}
                        {(maintenanceHistory.status === 'expired' ||
                          maintenanceHistory.status === 'pending') &&
                          maintenanceHistory.inProgress && <InProgressTag />}
                      </TagContainer>
                    ),
                  },

                  { cell: maintenanceHistory.buildingName },
                  { cell: maintenanceHistory.categoryName },
                  { cell: maintenanceHistory.element },
                  { cell: maintenanceHistory.activity },
                  { cell: maintenanceHistory.responsible ?? 'Sem responsável cadastrado' },
                  { cell: dateFormatter(maintenanceHistory.notificationDate) },
                  {
                    cell:
                      maintenanceHistory.type === 'common'
                        ? dateFormatter(maintenanceHistory.dueDate)
                        : '-',
                  },
                  {
                    cell:
                      maintenanceHistory.cost !== null
                        ? applyMask({ mask: 'BRL', value: String(maintenanceHistory.cost) }).value
                        : '-',
                  },
                ]}
                onClick={() => {
                  setMaintenanceHistoryId(maintenanceHistory.maintenanceHistoryId);

                  if (
                    (maintenanceHistory.status === 'completed' ||
                      maintenanceHistory.status === 'overdue' ||
                      maintenanceHistory.isFuture) &&
                    maintenanceHistory.id
                  ) {
                    handleModals('modalMaintenanceDetails', true);
                  } else if (!maintenanceHistory.isFuture && maintenanceHistory.id) {
                    handleModals('modalEditMaintenanceHistory', true);
                  }
                }}
              />
            ))}
          </ReportDataTable>
        </div>
      )}
    </>
  );
};
