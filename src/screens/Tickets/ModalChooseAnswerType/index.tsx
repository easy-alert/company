// LIBS
import styled from 'styled-components';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';

// GLOBAL STYLES
import { theme } from '@styles/theme';

interface IModalChooseAnswerType {
  ticketsToAnswer: string;
  handleModalChooseAnswerType: (modalState: boolean) => void;
  handleModalCreateOccasionalMaintenance: (modalState: boolean) => void;
  handleModalConnectTicketToExistingOccasionalMaintenances: (modalState: boolean) => void;
}

const ModalSelectMethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};

  div,
  button {
    width: 100%;
    justify-content: center;
  }

  > h5 {
    font-weight: 500;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

export const ModalChooseAnswerType = ({
  handleModalChooseAnswerType,
  handleModalCreateOccasionalMaintenance,
  handleModalConnectTicketToExistingOccasionalMaintenances,
  ticketsToAnswer,
}: IModalChooseAnswerType) => {
  const createNew = () => {
    handleModalChooseAnswerType(false);
    handleModalCreateOccasionalMaintenance(true);
  };

  const addExisting = () => {
    handleModalChooseAnswerType(false);
    handleModalConnectTicketToExistingOccasionalMaintenances(true);
  };

  return (
    <Modal setModal={handleModalChooseAnswerType} title="Responder chamados">
      <ModalSelectMethodContainer>
        <Text>
          <h5>Atenção</h5>

          <p className="p2">
            Você pode responder os chamados em aberto criando uma manutenção para realizá-la
            posteriormente, ou caso o problema já tenha sido reportado e/ou resolvido, selecione uma
            manutenção já existente
          </p>
        </Text>

        <p className="p1">{ticketsToAnswer}</p>

        <Button type="button" center onClick={createNew} label="Criar uma manutenção avulsa" />

        <Button
          center
          type="button"
          outlined
          onClick={addExisting}
          label="Selecionar uma manutenção existente"
        />
      </ModalSelectMethodContainer>
    </Modal>
  );
};
