import { useEffect } from 'react';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { CustomModal } from '../CustomModal';
import * as Style from './styles';

interface IModalLinkSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceHistoryId: string;
}

export const ModalLinkSupplier = ({ setModal, maintenanceHistoryId }: IModalLinkSupplier) => {
  const findCompanySuppliers = async () => {
    await Api.get(`/route/${maintenanceHistoryId}`)
      .then(() => {
        // console.log(res.data);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    findCompanySuppliers();
  }, []);

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
            {/* <p className="p4 opacity">Nenhum fornecedor encontrado.</p> */}
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
