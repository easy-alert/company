// COMPONENTS

import * as Style from './styles';

// TYPES
import { IModalCreateOccasionalMaintenanceInstructions } from './utils/types';

// FUNCTIONS
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Buttons/Button';

export const ModalCreateOccasionalMaintenanceInstructions = ({
  setView,
  setModal,
}: IModalCreateOccasionalMaintenanceInstructions) => (
  <Modal title="Manutenção avulsa" setModal={setModal}>
    <Style.ModalInfoContainer>
      <h6>Atenção</h6>
      <p className="p2">
        O recurso de manutenções avulsas somente deve ser utilizado para indicar o relato de uma
        manutenção não prevista no plano de manutenção da edificação.
      </p>

      <p className="p2">
        Certifique-se de que a manutenção a ser apontada, não consta no plano da edificação antes de
        continuar.
      </p>

      <Style.ButtonContainer>
        <Button center label="Confirmar" onClick={() => setView(1)} />
      </Style.ButtonContainer>
    </Style.ModalInfoContainer>
  </Modal>
);
