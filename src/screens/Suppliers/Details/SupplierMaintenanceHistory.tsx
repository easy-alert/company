import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InProgressTag } from '../../../components/InProgressTag';
import { dateFormatter, applyMask, catchHandler } from '../../../utils/functions';
import { EventTag } from '../../Calendar/utils/EventTag';
import {
  ReportDataTable,
  ReportDataTableContent,
} from '../../Reports/Maintenances/ReportDataTable';
import { ModalMaintenanceDetails } from '../../Calendar/utils/ModalMaintenanceDetails';
import { ModalEditMaintenanceReport } from '../../Reports/Maintenances/ModalEditMaintenanceReport';
import { ModalSendMaintenanceReport } from '../../Reports/Maintenances/ModalSendMaintenanceReport';
import { IMaintenanceReportData } from '../../Reports/Maintenances/types';
import { TagContainer } from '../../Reports/Maintenances/styles';
import { Api } from '../../../services/api';

export const SupplierMaintenanceHistory = () => {
  const { supplierId } = useParams() as { supplierId: string };
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalEditReport, setModalEditReport] = useState<boolean>(false);

  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');
  const [modalSendMaintenanceReportOpen, setModalSendMaintenanceReportOpen] =
    useState<boolean>(false);

  const [maintenances, setMaintenances] = useState<IMaintenanceReportData[]>([]);

  const getMaintenanceHistory = async () => {
    await Api.get(`/suppliers/${supplierId}/maintenance-history`)
      .then((res) => {
        setMaintenances(res.data.maintenances);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getMaintenanceHistory();
  }, []);

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

      {maintenances.length > 0 && (
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
            {maintenances?.map((maintenance) => (
              <ReportDataTableContent
                key={maintenance.id}
                colsBody={[
                  {
                    cell: (
                      <TagContainer>
                        {maintenance.status === 'overdue' && <EventTag status="completed" />}
                        <EventTag status={maintenance.status} />
                        {maintenance.type === 'occasional' ? (
                          <EventTag status="occasional" />
                        ) : (
                          <EventTag status="common" />
                        )}
                        {(maintenance.status === 'expired' || maintenance.status === 'pending') &&
                          maintenance.inProgress && <InProgressTag />}
                      </TagContainer>
                    ),
                  },

                  { cell: maintenance.buildingName },
                  { cell: maintenance.categoryName },
                  { cell: maintenance.element },
                  { cell: maintenance.activity },
                  { cell: maintenance.responsible ?? 'Sem responsável cadastrado' },
                  { cell: dateFormatter(maintenance.notificationDate) },
                  {
                    cell: maintenance.type === 'common' ? dateFormatter(maintenance.dueDate) : '-',
                  },
                  {
                    cell:
                      maintenance.cost !== null
                        ? applyMask({ mask: 'BRL', value: String(maintenance.cost) }).value
                        : '-',
                  },
                ]}
                onClick={() => {
                  setMaintenanceHistoryId(maintenance.maintenanceHistoryId);

                  if (
                    (maintenance.status === 'completed' ||
                      maintenance.status === 'overdue' ||
                      maintenance.isFuture) &&
                    maintenance.id
                  ) {
                    setModalMaintenanceDetails(true);
                  } else if (!maintenance.isFuture && maintenance.id) {
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
