// COMPONENTS
import { Button } from '../../../../components/Buttons/Button';
import { Modal } from '../../../../components/Modal';
import { EventTag } from '../EventTag';

// STYLES
import * as Style from './styles';

// TYPES
import { IModalMaintenanceInfo } from './utils/types';

export const ModalMaintenanceInfo = ({
  setModal,
  selectedMaintenanceId,
}: IModalMaintenanceInfo) => (
  <Modal title="Detalhes de manutenção" setModal={setModal}>
    <Style.Container>
      <h3>{selectedMaintenanceId}</h3>
      <Style.TagWrapper>
        {/* if pra se for feita em atraso, mostrar o concluída */}
        <EventTag status="Concluída" />
        <EventTag status="Feita em atraso" />
      </Style.TagWrapper>
      <Style.Content>
        <Style.Row>
          <h6>Categoria</h6>
          <p className="p2">Sistemas Hidrossanitários</p>
        </Style.Row>
        <Style.Row>
          <h6>Elemento</h6>
          <p className="p2">Tubulações</p>
        </Style.Row>
        <Style.Row>
          <h6>Responsável</h6>
          <p className="p2">Equipe de manutenção local</p>
        </Style.Row>
        <Style.Row>
          <h6>Atividade</h6>
          <p className="p2">
            Verificar as tubulações de água potável e servida para detectar obstruções, falhas,
            entupimentos e problemas de fixação. Reconstruir a sua integridade, se necessário.
          </p>
        </Style.Row>
        <Style.Row>
          <h6>Prazo da manutenção</h6>
          <p className="p2">20/01/2023</p>
        </Style.Row>
        <Style.Row>
          <h6>Observações</h6>
          <p className="p2">2</p>
        </Style.Row>
        <Style.Row>
          <h6>Anexar</h6>
          <p className="p2">2</p>
        </Style.Row>
        <Style.Row>
          <h6>Imagens</h6>
          <p className="p2">2</p>
        </Style.Row>
      </Style.Content>
      <Button label="Enviar relato" center />
    </Style.Container>
  </Modal>
);
