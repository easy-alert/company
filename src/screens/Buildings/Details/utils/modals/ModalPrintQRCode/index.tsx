// COMPONENTS
import { Modal } from '../../../../../../components/Modal';

// TYPES
import { IModalPrintQRCode } from './utils/types';

// STYLES
import * as Style from './styles';

export const ModalPrintQRCode = ({ setModal }: IModalPrintQRCode) => (
  <Modal title="Cadastrar anexos" setModal={setModal}>
    <Style.Container>QR Code para impressão</Style.Container>
  </Modal>
);
