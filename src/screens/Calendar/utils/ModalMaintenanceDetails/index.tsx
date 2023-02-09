/* eslint-disable react/no-array-index-key */

// COMPONENTS
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Buttons/Button';
import { Modal } from '../../../../components/Modal';
import { EventTag } from '../EventTag';
import { DotSpinLoading } from '../../../../components/Loadings/DotSpinLoading';

// STYLES
import * as Style from './styles';

// TYPES
import { IModalMaintenanceDetails } from './types';

// FUNCTIONS
import { requestMaintenanceDetails } from './functions';
import { IMaintenance } from '../../types';

export const ModalMaintenanceDetails = ({
  setModal,
  maintenanceHistoryId,
}: IModalMaintenanceDetails) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [maintenance, setMaintenance] = useState<IMaintenance>({} as IMaintenance);

  useEffect(() => {
    requestMaintenanceDetails({ maintenanceHistoryId, setMaintenance, setLoading });
  }, []);

  return (
    <Modal title="Detalhes de manutenção" setModal={setModal}>
      {loading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <h3>{maintenance?.Building.name}</h3>
          <Style.StatusTagWrapper>
            {maintenance.MaintenancesStatus.name === 'overdue' && <EventTag status="completed" />}
            <EventTag status={maintenance?.MaintenancesStatus.name} />
          </Style.StatusTagWrapper>
          <Style.Content>
            <Style.Row>
              <h6>Categoria</h6>
              <p className="p2">{maintenance.Maintenance.Category.name}</p>
            </Style.Row>
            <Style.Row>
              <h6>Elemento</h6>
              <p className="p2">{maintenance.Maintenance.element}</p>
            </Style.Row>
            <Style.Row>
              <h6>Atividade</h6>
              <p className="p2">{maintenance.Maintenance.element}</p>
            </Style.Row>
            <Style.Row>
              <h6>Responsável</h6>
              <p className="p2">{maintenance.Maintenance.responsible}</p>
            </Style.Row>
          </Style.Content>

          {maintenance.MaintenanceReport.length > 0 && 'TEM REPORTS'}

          <Button
            label="Fechar"
            center
            onClick={() => {
              setModal(false);
            }}
          />
        </Style.Container>
      )}
    </Modal>
  );
};
