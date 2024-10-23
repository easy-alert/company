// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { InProgressTag } from '@components/InProgressTag';

// UTILS
import { dateFormatter, applyMask } from '@utils/functions';

// COMPONENTS
import { EventTag } from '../../../Calendar/utils/EventTag';
import {
  ReportDataTable,
  ReportDataTableContent,
} from '../../../Reports/Maintenances/ReportDataTable';
import { ModalMaintenanceDetails } from '../../../Calendar/utils/ModalMaintenanceDetails';
import { ModalEditMaintenanceReport } from '../../../Reports/Maintenances/ModalEditMaintenanceReport';
import { ModalSendMaintenanceReport } from '../../../Reports/Maintenances/ModalSendMaintenanceReport';

// STYLES
import { TagContainer } from '../../../Reports/Maintenances/styles';

// TYPES
import type { ISupplierMaintenanceHistory } from './types';

export const SupplierMaintenanceHistory = ({
  maintenancesHistory,
  getMaintenanceHistory,
}: ISupplierMaintenanceHistory) => {
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalEditReport, setModalEditReport] = useState<boolean>(false);

  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');
  const [modalSendMaintenanceReportOpen, setModalSendMaintenanceReportOpen] =
    useState<boolean>(false);

  return (
    <>
      {modalMaintenanceDetails && maintenanceHistoryId && (
        <ModalMaintenanceDetails
          setModal={setModalMaintenanceDetails}
          setModalEditReport={setModalEditReport}
          modalAdditionalInformations={{
            expectedDueDate: '',
            expectedNotificationDate: '',
            id: maintenanceHistoryId,
            isFuture: false,
          }}
        />
      )}

      {modalSendMaintenanceReportOpen && maintenanceHistoryId && (
        <ModalSendMaintenanceReport
          setModal={setModalSendMaintenanceReportOpen}
          maintenanceHistoryId={maintenanceHistoryId}
          onThenRequest={async () => {
            getMaintenanceHistory();
          }}
        />
      )}

      {modalEditReport && maintenanceHistoryId && (
        <ModalEditMaintenanceReport
          onThenActionRequest={async () => {
            getMaintenanceHistory();
          }}
          setModal={setModalEditReport}
          maintenanceHistoryId={maintenanceHistoryId}
        />
      )}

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
                    setModalMaintenanceDetails(true);
                  } else if (!maintenanceHistory.isFuture && maintenanceHistory.id) {
                    setModalSendMaintenanceReportOpen(true);
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
