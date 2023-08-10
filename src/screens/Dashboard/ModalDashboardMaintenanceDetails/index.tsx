/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import * as Style from './styles';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { Modal } from '../../../components/Modal';
import { catchHandler } from '../../../utils/functions';
import { Api } from '../../../services/api';

interface IModalDashboardMaintenanceDetails {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceId: string;
}

interface IMaintenance {
  categoryName: string;
  id: string;
  element: string;
  activity: string;
  frequency: number;
  FrequencyTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  responsible: string;
  source: string;
  period: number;
  PeriodTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  ownerCompanyId: string | null;
  delay: number;
  DelayTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  observation: string;
}

export const ModalDashboardMaintenanceDetails = ({
  setModal,
  maintenanceId,
}: IModalDashboardMaintenanceDetails) => {
  const [modalLoading, setModalLoading] = useState<boolean>(true);

  const [maintenance, setMaintenance] = useState<IMaintenance>({
    categoryName: '',
    id: '',
    element: '',
    activity: '',
    frequency: 0,
    FrequencyTimeInterval: {
      name: '',
      id: '',
      pluralLabel: '',
      singularLabel: '',
      unitTime: 0,
    },
    responsible: '',
    source: '',
    period: 0,
    PeriodTimeInterval: {
      name: '',
      id: '',
      pluralLabel: '',
      singularLabel: '',
      unitTime: 0,
    },
    ownerCompanyId: '',
    delay: 0,
    DelayTimeInterval: {
      name: '',
      id: '',
      pluralLabel: '',
      singularLabel: '',
      unitTime: 0,
    },
    observation: '',
  });

  const getMaintenanceData = async () => {
    await Api.get(`/dashboard/abc/${maintenanceId}`)
      .then(({ data }) => {
        setMaintenance(data);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  useEffect(() => {
    getMaintenanceData();
  }, []);

  return (
    <Modal title="Detalhes de manutenção" setModal={setModal}>
      {modalLoading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <Style.Content>
            <Style.Row>
              <h6>Números</h6>
              <Style.CountWrapper>
                <Style.Count>
                  <h4 className="count">2</h4>
                  <p className="p2">Concluídas</p>
                </Style.Count>

                <Style.Count>
                  <h4 className="total">6</h4>
                  <p className="p2">Ocorrências</p>
                </Style.Count>
              </Style.CountWrapper>
            </Style.Row>

            <Style.Row>
              <h6>Categoria</h6>
              <p className="p2">{maintenance.categoryName}</p>
            </Style.Row>

            <Style.Row>
              <h6>Elemento</h6>
              <p className="p2">{maintenance.element}</p>
            </Style.Row>

            <Style.Row>
              <h6>Atividade</h6>
              <p className="p2">{maintenance.activity}</p>
            </Style.Row>
            <Style.Row>
              <h6>Periodicidade</h6>
              <p className="p2">
                {maintenance.frequency > 1
                  ? `${maintenance.frequency} ${maintenance.FrequencyTimeInterval.pluralLabel}`
                  : `${maintenance.frequency} ${maintenance.FrequencyTimeInterval.singularLabel}`}
              </p>
            </Style.Row>

            <Style.Row>
              <h6>Responsável</h6>
              <p className="p2">{maintenance.responsible}</p>
            </Style.Row>

            <Style.Row>
              <h6>Fonte</h6>
              <p className="p2">{maintenance.source}</p>
            </Style.Row>

            <Style.Row>
              <h6>Observação da manutenção</h6>
              <p className="p2">{maintenance.observation ?? '-'}</p>
            </Style.Row>

            <Style.Row>
              <h6>Prazo para execução</h6>
              <p className="p2">
                {maintenance.period > 1
                  ? `${maintenance.period} ${maintenance.PeriodTimeInterval.pluralLabel}`
                  : `${maintenance.period} ${maintenance.PeriodTimeInterval.singularLabel}`}
              </p>
            </Style.Row>

            <Style.Row>
              <h6>Delay</h6>
              <p className="p2">
                {maintenance.delay > 1
                  ? `${maintenance.delay} ${maintenance.DelayTimeInterval.pluralLabel}`
                  : `${maintenance.delay} ${maintenance.DelayTimeInterval.singularLabel}`}
              </p>
            </Style.Row>
          </Style.Content>
        </Style.Container>
      )}
    </Modal>
  );
};
