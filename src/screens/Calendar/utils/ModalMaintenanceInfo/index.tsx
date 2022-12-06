// COMPONENTS
import { Modal } from '../../../../components/Modal';

// STYLES
import * as Style from './styles';

// TYPES
import { IModalMaintenanceInfo } from './utils/types';

export const ModalMaintenanceInfo = ({ setModal, eventId }: IModalMaintenanceInfo) => (
  <Modal title="Detalhes" setModal={setModal}>
    <Style.Container>
      <h5>{eventId}</h5>
    </Style.Container>
  </Modal>
);
