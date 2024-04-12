import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from '../../../components/Modal';
import { theme } from '../../../styles/theme';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { Button } from '../../../components/Buttons/Button';
import {
  DayInfo,
  DayWrapper,
  Maintenance,
  MaintenanceTags,
  NoDataDayWrapper,
  NoMaintenanceCard,
} from '../styles';
import { InProgressTag } from '../../../components/InProgressTag';
import { EventTag } from '../../Calendar/utils/EventTag';

interface MaintenancesStatus {
  name: string;
}
interface Maintenance {
  element: string;
  activity: string;
}

interface IOccasionalMaintenances {
  id: string;
  notificationDate: string;
  inProgress: boolean;
  MaintenancesStatus: MaintenancesStatus;
  Maintenance: Maintenance;
}

interface IModalConnectTicketToExistingOccasionalMaintenances {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  ticketsToAnswer: string;
  ticketIds: string[];
  resetSelectedTickets: () => void;
  onThenRequest: () => Promise<void>;
  buildingNanoId: string;
}

const ModalSelectMethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  margin-bottom: ${theme.size.sm};

  > h5 {
    font-weight: 500;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

const Scroll = styled.div`
  max-height: 500px;
  overflow-y: auto;

  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.size.xsm};
`;

export const ModalConnectTicketToExistingOccasionalMaintenances = ({
  setModal,
  ticketsToAnswer,
  resetSelectedTickets,
  ticketIds,
  onThenRequest,
  buildingNanoId,
}: IModalConnectTicketToExistingOccasionalMaintenances) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [occasionalMaintenances, setOccasionalMaintenances] = useState<IOccasionalMaintenances[]>(
    [],
  );

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const [selectedMaintenanceHistoryId, setSelectedMaintenanceHistoryId] = useState('');

  const requestLast60DaysOccasionalMaintenances = async () => {
    await Api.get(`/tickets/extras/occasional-maintenances/${buildingNanoId}`)
      .then((res) => {
        setOccasionalMaintenances(res.data.occasionalMaintenances);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  const answerTickets = async () => {
    setOnQuery(true);

    await Api.post(`/tickets/connect-to-maintenance`, {
      ticketIds,
      maintenanceHistoryId: selectedMaintenanceHistoryId,
    })
      .then((res) => {
        toast.success(res.data.ServerMessage.message);
        resetSelectedTickets();
        setModal(false);
        onThenRequest();
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  useEffect(() => {
    requestLast60DaysOccasionalMaintenances();
  }, []);

  return (
    <Modal setModal={setModal} title="Selecionar manutenções para chamados">
      <>
        <ModalSelectMethodContainer>
          <Text>
            <h5>Atenção</h5>
            <p className="p2">
              Selecione uma das manutenções abaixo para ser vinculada aos chamados (Somente
              manutenções avulsas dos últimos 60 dias estão disponíveis).
            </p>
          </Text>
          <p className="p1">{ticketsToAnswer}</p>

          <Scroll>
            {occasionalMaintenances.length > 0 ? (
              occasionalMaintenances.map((maintenance) => (
                <DayWrapper
                  reduceOpacity={
                    maintenance.id !== selectedMaintenanceHistoryId &&
                    !!selectedMaintenanceHistoryId
                  }
                  key={maintenance.id}
                  onClick={() => {
                    setSelectedMaintenanceHistoryId(maintenance.id);
                  }}
                >
                  <DayInfo width="55px">
                    <p className="p3">
                      {`${String(new Date(maintenance.notificationDate).getDate()).padStart(
                        2,
                        '0',
                      )}/${String(new Date(maintenance.notificationDate).getMonth() + 1).padStart(
                        2,
                        '0',
                      )}`}
                    </p>
                    <p className="p3">{days[new Date(maintenance.notificationDate).getDay()]}</p>
                  </DayInfo>
                  <Maintenance status={maintenance.MaintenancesStatus.name}>
                    <MaintenanceTags>
                      {maintenance.MaintenancesStatus.name === 'overdue' && (
                        <EventTag status="completed" />
                      )}
                      <EventTag status={maintenance.MaintenancesStatus.name} />

                      {(maintenance.MaintenancesStatus.name === 'expired' ||
                        maintenance.MaintenancesStatus.name === 'pending') &&
                        maintenance.inProgress && <InProgressTag />}
                    </MaintenanceTags>

                    <h6>{maintenance.Maintenance.element}</h6>
                    <p className="p2">{maintenance.Maintenance.activity}</p>
                  </Maintenance>
                </DayWrapper>
              ))
            ) : (
              <NoDataDayWrapper>
                <NoMaintenanceCard>
                  <h6>Nenhuma manutenção encontrada</h6>
                </NoMaintenanceCard>
              </NoDataDayWrapper>
            )}
          </Scroll>
        </ModalSelectMethodContainer>
        <Button
          label="Concluir"
          center
          onClick={answerTickets}
          loading={onQuery}
          disable={!selectedMaintenanceHistoryId}
        />
      </>
    </Modal>
  );
};
