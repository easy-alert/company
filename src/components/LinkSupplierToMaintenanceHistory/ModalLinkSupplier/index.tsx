import { CustomModal } from '../CustomModal';
import * as Style from './styles';

interface IModalLinkSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalLinkSupplier = ({ setModal }: IModalLinkSupplier) => {
  const teste = 'oi';

  return (
    <CustomModal setModal={setModal} title="Vincular fornecedor" id="supplier">
      <Style.Container>
        <p className="p2">Clique em uma das opções abaixo para vincular o fornecedor desejado:</p>

        <Style.Content>
          <Style.Section>
            <h6>Sugeridos</h6>
            <Style.Card selected>
              <p className="p4">Nome do fornecedor</p>
              <p className="p5">Area 1, area 2.</p>
            </Style.Card>
          </Style.Section>

          <Style.Section>
            <h6>Todos</h6>
            <Style.Card selected={false}>
              <p className="p4">Nome do fornecedor</p>
              <p className="p5">Area 1, area 2.</p>
            </Style.Card>
          </Style.Section>
        </Style.Content>
        {/*
        <p className="p2">
          Não encontrou o fornecedor que procura?{' '}
          <button type="button">Clique aqui para cadastrar!</button>
        </p> */}
      </Style.Container>
    </CustomModal>
  );
};
