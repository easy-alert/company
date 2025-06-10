import { Button } from '@components/Buttons/Button';

import type { IModalFirstView } from '../types';

import * as Style from '../styles';

const ModalFirstView = ({ handleSetView }: IModalFirstView) => (
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
      <Button center label="Confirmar" onClick={() => handleSetView(2)} />
    </Style.ButtonContainer>
  </Style.ModalInfoContainer>
);

export default ModalFirstView;
