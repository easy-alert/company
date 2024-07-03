import { CustomModal } from '../CustomModal';
import * as Style from './styles';

interface IModalLinkSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalLinkSupplier = ({ setModal }: IModalLinkSupplier) => {
  const teste = 'oi';

  return (
    <CustomModal setModal={setModal} title="Vincular fornecedor" id="supplier">
      <Style.Container>{teste}</Style.Container>
    </CustomModal>
  );
};
