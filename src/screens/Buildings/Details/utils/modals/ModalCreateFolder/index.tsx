// COMPONENTS
import { Modal } from '../../../../../../components/Modal';

// STYLES
import * as Style from './styles';

// FUNCTIONS
import { IModalAddFiles } from './types';

export const ModalCreateFolder = ({ setModal }: IModalAddFiles) => {
  const t = 'oi';

  return (
    <Modal title="Criar pasta" setModal={setModal}>
      <Style.Container>{t}</Style.Container>
    </Modal>
  );
};
