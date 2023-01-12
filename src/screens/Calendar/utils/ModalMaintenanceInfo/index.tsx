// COMPONENTS
import { Modal } from '../../../../components/Modal';

// STYLES
import * as Style from './styles';

// TYPES
import { IModalMaintenanceInfo } from './utils/types';

export const ModalMaintenanceInfo = ({
  setModal,
  selectedMaintenanceId,
}: IModalMaintenanceInfo) => (
  <Modal title="Detalhes de manutenção" setModal={setModal}>
    <Style.Container>
      <h5>{selectedMaintenanceId}</h5>
    </Style.Container>
  </Modal>
);
