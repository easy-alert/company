/* eslint-disable react/no-array-index-key */
import { Modal } from '@components/Modal';
import { theme } from '@styles/theme';
import * as Style from './styles';

interface IMaintenance {
  Category: {
    name: string;
  };
  id: string;
  element: string;
  activity: string;
  frequency: number;
  FrequencyTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  responsible: string;
  source: string;
  period: number;
  PeriodTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  delay: number;
  DelayTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  observation: string;
}

interface IRating {
  allCount: number;
  count: number;
  data: IMaintenance;
  id: string;
  rating: number;
}

interface IModalDashboardMaintenanceDetails {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  rating: IRating;
  status: 'completed' | 'expired' | '';
}

export const ModalDashboardMaintenanceDetails = ({
  setModal,
  rating,
  status,
}: IModalDashboardMaintenanceDetails) => (
  <Modal title="Detalhes de manutenção" setModal={setModal}>
    <Style.Container>
      <Style.Content>
        <Style.Row>
          <h6>Números</h6>
          <Style.CountWrapper>
            <Style.Count>
              <h4
                style={{
                  color: status === 'completed' ? theme.color.success : theme.color.actionDanger,
                }}
              >
                {rating.count}
              </h4>
              <p className="p2">{status === 'completed' ? 'Concluídas' : 'Vencidas'}</p>
            </Style.Count>

            <Style.Count>
              <h4 className="total">{rating.allCount}</h4>
              <p className="p2">Ocorrências</p>
            </Style.Count>
          </Style.CountWrapper>
        </Style.Row>

        <Style.Row>
          <h6>Categoria</h6>
          <p className="p2">{rating.data.Category.name}</p>
        </Style.Row>

        <Style.Row>
          <h6>Elemento</h6>
          <p className="p2">{rating.data.element}</p>
        </Style.Row>

        <Style.Row>
          <h6>Atividade</h6>
          <p className="p2">{rating.data.activity}</p>
        </Style.Row>
        <Style.Row>
          <h6>Periodicidade</h6>
          <p className="p2">
            A cada{' '}
            {rating.data.frequency > 1
              ? `${rating.data.frequency} ${rating.data.FrequencyTimeInterval.pluralLabel}`
              : `${rating.data.frequency} ${rating.data.FrequencyTimeInterval.singularLabel}`}
          </p>
        </Style.Row>

        <Style.Row>
          <h6>Responsável</h6>
          <p className="p2">{rating.data.responsible}</p>
        </Style.Row>

        <Style.Row>
          <h6>Fonte</h6>
          <p className="p2">{rating.data.source}</p>
        </Style.Row>

        <Style.Row>
          <h6>Observação da manutenção</h6>
          <p className="p2">{rating.data.observation ?? '-'}</p>
        </Style.Row>

        <Style.Row>
          <h6>Prazo para execução</h6>
          <p className="p2">
            {rating.data.period > 1
              ? `${rating.data.period} ${rating.data.PeriodTimeInterval.pluralLabel}`
              : `${rating.data.period} ${rating.data.PeriodTimeInterval.singularLabel}`}
          </p>
        </Style.Row>
      </Style.Content>
    </Style.Container>
  </Modal>
);
