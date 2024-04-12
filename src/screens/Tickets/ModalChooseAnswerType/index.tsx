import styled from 'styled-components';
import { Button } from '../../../components/Buttons/Button';
import { Modal } from '../../../components/Modal';
import { theme } from '../../../styles/theme';

interface IModalChooseAnswerType {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setModalCreateOccasionalMaintenance: React.Dispatch<React.SetStateAction<boolean>>;
  setModalSelectOccasionalMaintenance: React.Dispatch<React.SetStateAction<boolean>>;
  ticketsToAnswer: string;
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
  setModal,
  setModalCreateOccasionalMaintenance,
  setModalSelectOccasionalMaintenance,
  ticketsToAnswer
}: IModalChooseAnswerType) => {
  const createNew = () => {
    setModal(false);
    setModalCreateOccasionalMaintenance(true);
  };

  const addExisting = () => {
    setModal(false);
    setModalSelectOccasionalMaintenance(true);
  };

  return (
    <Modal setModal={setModal} title="Responder chamados">
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
