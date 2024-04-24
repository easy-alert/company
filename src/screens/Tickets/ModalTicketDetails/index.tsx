import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { Modal } from '../../../components/Modal';
import * as Style from './styles';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { ImagePreview } from '../../../components/ImagePreview';
import { ListTag } from '../../../components/ListTag';
import { theme } from '../../../styles/theme';
import { TagsArray } from '../../../components/TagsArray';
import { PopoverButton } from '../../../components/Buttons/PopoverButton';

interface IModalTicketDetails {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  ticketId: string;
  onThenRequest: () => Promise<void>;
}

interface Image {
  id: string;
  ticketId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
interface Status {
  name: string;
  label: string;
  color: string;
  backgroundColor: string;
}
interface Place {
  id: string;
  label: string;
}
interface Type {
  type: Place;
}
interface Company {
  canAccessTickets: boolean;
}
interface Building {
  nanoId: string;
  id: string;
  name: string;
  Company: Company;
}

interface ITicket {
  id: string;
  residentName: string;
  residentApartment: string;
  residentEmail: string;
  description: string;
  placeId: string;
  statusName: string;
  buildingId: string;
  ticketNumber: number;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  status: Status;
  place: Place;
  types: Type[];
  building: Building;
}

export const ModalTicketDetails = ({ setModal, ticketId, onThenRequest }: IModalTicketDetails) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<ITicket>();
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const deleteTicket = async () => {
    setOnQuery(true);

    await Api.delete(`/tickets/${ticket?.id}`)
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        setModal(false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const findChecklistById = async () => {
    await Api.get(`/tickets/${ticketId}`)
      .then((res) => {
        setTicket(res.data.ticket);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findChecklistById();
  }, []);

  return (
    <Modal title={`Detalhes do chamado #${ticket?.ticketNumber}`} setModal={setModal}>
      {loading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <Style.Content>
            <Style.Row>
              <h6>Edificação</h6>
              <p className="p2">{ticket?.building.name}</p>
            </Style.Row>

            <Style.Row>
              <h6>Nome do morador</h6>
              <p className="p2">{ticket?.residentName}</p>
            </Style.Row>

            <Style.Row>
              <h6>Apartamento do morador</h6>
              <p className="p2">{ticket?.residentApartment}</p>
            </Style.Row>

            <Style.Row>
              <h6>E-mail do morador</h6>
              <p className="p2">{ticket?.residentEmail || '-'}</p>
            </Style.Row>

            <Style.Row>
              <h6>Local da ocorrência</h6>
              <ListTag
                label={ticket?.place.label || '-'}
                backgroundColor={theme.color.gray4}
                color="#ffffff"
                fontWeight={500}
                padding="2px 4px"
                fontSize="12px"
              />
            </Style.Row>

            <Style.Row>
              <h6>Tipo da manutenção</h6>
              <TagsArray data={ticket?.types.map(({ type }) => type.label)} />
            </Style.Row>

            <Style.Row>
              <h6>Descrição</h6>
              <pre className="p2">{ticket?.description}</pre>
            </Style.Row>

            <Style.Row>
              <h6>Imagens</h6>
              <Style.FileAndImageRow>
                {ticket && ticket.images.length > 0 ? (
                  ticket?.images.map((image) => (
                    <ImagePreview
                      key={image.url}
                      src={image.url}
                      downloadUrl={image.url}
                      imageCustomName={image.name}
                      width="132px"
                      height="136px"
                    />
                  ))
                ) : (
                  <p className="p2">Nenhuma imagem enviada.</p>
                )}
              </Style.FileAndImageRow>
            </Style.Row>
          </Style.Content>
          <Style.Buttons>
            <PopoverButton
              borderless
              disabled={onQuery}
              actionButtonBgColor={theme.color.actionDanger}
              type="Button"
              label="Excluir"
              message={{
                title: 'Deseja excluir este chamado?',
                content: 'Atenção, essa ação é irreversível.',
                contentColor: theme.color.danger,
              }}
              actionButtonClick={deleteTicket}
            />
          </Style.Buttons>
        </Style.Container>
      )}
    </Modal>
  );
};
