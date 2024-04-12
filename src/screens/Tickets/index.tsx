/* eslint-disable import/no-cycle */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Style from './styles';
import { catchHandler, dateFormatter } from '../../utils/functions';
import { Api } from '../../services/api';
import { Image } from '../../components/Image';
import { ListTag } from '../../components/ListTag';
import { TagsArray } from '../../components/TagsArray';
import { InputCheckbox } from '../../components/Inputs/InputCheckbox';
import { IconButton } from '../../components/Buttons/IconButton';
import { icon } from '../../assets/icons';
import { theme } from '../../styles/theme';
import { Button } from '../../components/Buttons/Button';
import { Select } from '../../components/Inputs/Select';
import { ModalTicketDetails } from './ModalTicketDetails';
import { Input } from '../../components/Inputs/Input';
import { Pagination } from '../../components/Pagination';
import { ModalChooseAnswerType } from './ModalChooseAnswerType';
import { ModalCreateOccasionalMaintenanceForTicket } from './ModalCreateOccasionalMaintenanceForTicket';
import { ModalConnectTicketToExistingOccasionalMaintenances } from './ModalConnectTicketToExistingOccasionalMaintenances';
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';
import { LoadingWrapper } from '../../components/Loadings/LoadingWrapper';

interface IImage {
  id: string;
  ticketId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
interface IStatus {
  name: string;
  label: string;
  color: string;
  backgroundColor: string;
}
interface IPlace {
  id: string;
  label: string;
}
interface IType {
  type: IPlace;
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
  images: IImage[];
  status: IStatus;
  place: IPlace;
  types: IType[];
}

interface IStatusOptions {
  name: string;
  label: string;
}

interface ITicketsToAnswer {
  id: string;
  ticketNumber: number;
}

interface IBuildingOptions {
  name: string;
  nanoId: string;
  id: string;
}

export const Tickets = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [modalTicketDetailsOpen, setModalTicketDetailsOpen] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [statusOptions, setStatusOptions] = useState<IStatusOptions[]>([]);
  const [initialCreatedAt, setInitialCreatedAt] = useState<string>('');
  const [finalCreatedAt, setFinalCreatedAt] = useState<string>('');
  const [statusName, setStatusName] = useState<string>('');
  const [ticketsToAnswer, setTicketsToAnswer] = useState<ITicketsToAnswer[]>([]);
  const [buildingNanoId, setBuildingNanoId] = useState<string>('');
  const [buildingId, setBuildingId] = useState<string>('');

  const [modalChooseAnswerType, setModalChooseAnswerType] = useState<boolean>(false);
  const [modalCreateOccasionalMaintenanceForTicket, setModalCreateOccasionalMaintenanceForTicket] =
    useState<boolean>(false);
  const [
    modalConnectTicketToExistingOccasionalMaintenances,
    setModalConnectTicketToExistingOccasionalMaintenances,
  ] = useState<boolean>(false);

  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const take = 12;

  const [buildingOptions, setBuildingOptions] = useState<IBuildingOptions[]>([]);

  const findManyTickets = async (pageParam?: number) => {
    setOnQuery(true);
    setLoading(true);

    await Api.get(
      `/tickets/buildings/${buildingNanoId}?statusName=${statusName}&initialCreatedAt=${initialCreatedAt}&finalCreatedAt=${finalCreatedAt}&page=${
        pageParam || page
      }&take=${take}`,
    )
      .then((res) => {
        setTickets(res.data.tickets);
        setCount(res.data.ticketsCount);
        setStatusOptions(res.data.status);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
        setLoading(false);
      });
  };

  const findBuildingsForSelect = async () => {
    await Api.get('/buildings/listforselect')
      .then((res) => {
        setBuildingOptions(res.data);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findBuildingsForSelect();
  }, []);

  useEffect(() => {
    if (buildingNanoId) {
      findManyTickets();
    }
  }, [buildingNanoId]);

  const resetSelectedTickets = () => {
    setTicketsToAnswer([]);
  };

  const ticketsToAnswerString = `Chamados selecionados: ${ticketsToAnswer
    .map(({ ticketNumber }) => `#${ticketNumber}`)
    .join(', ')}`;

  const ticketIds = ticketsToAnswer.map(({ id }) => id);

  return (
    <>
      {modalTicketDetailsOpen && (
        <ModalTicketDetails setModal={setModalTicketDetailsOpen} ticketId={selectedTicketId} />
      )}
      {modalChooseAnswerType && (
        <ModalChooseAnswerType
          setModal={setModalChooseAnswerType}
          setModalCreateOccasionalMaintenance={setModalCreateOccasionalMaintenanceForTicket}
          setModalSelectOccasionalMaintenance={
            setModalConnectTicketToExistingOccasionalMaintenances
          }
          ticketsToAnswer={ticketsToAnswerString}
        />
      )}
      {modalCreateOccasionalMaintenanceForTicket && (
        <ModalCreateOccasionalMaintenanceForTicket
          setModal={setModalCreateOccasionalMaintenanceForTicket}
          onThenRequest={findManyTickets}
          ticketsToAnswer={ticketsToAnswerString}
          ticketIds={ticketIds}
          resetSelectedTickets={resetSelectedTickets}
          buildingId={buildingId}
        />
      )}
      {modalConnectTicketToExistingOccasionalMaintenances && (
        <ModalConnectTicketToExistingOccasionalMaintenances
          setModal={setModalConnectTicketToExistingOccasionalMaintenances}
          ticketsToAnswer={ticketsToAnswerString}
          ticketIds={ticketIds}
          resetSelectedTickets={resetSelectedTickets}
          onThenRequest={findManyTickets}
          buildingNanoId={buildingNanoId}
        />
      )}
      <Style.Container>
        <Style.Header>
          <Style.HeaderWrapper>
            <Style.HeaderLeftSide>
              <h2>Chamados</h2>
              <Select
                id="customFilterForChecklist"
                disabled={loading}
                selectPlaceholderValue=" "
                value={buildingNanoId}
                onChange={(evt) => {
                  const building = buildingOptions.find(
                    ({ nanoId }) => nanoId === evt.target.value,
                  );
                  setBuildingNanoId(evt.target.value);
                  setBuildingId(building?.id || '');
                }}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>
                {buildingOptions.map(({ nanoId, name }) => (
                  <option value={nanoId} key={nanoId}>
                    {name}
                  </option>
                ))}
              </Select>
              <IconButton
                icon={icon.filter}
                size="16px"
                label={showFilter ? 'Ocultar' : 'Filtrar'}
                color={theme.color.gray5}
                onClick={() => {
                  setShowFilter(!showFilter);
                }}
              />
            </Style.HeaderLeftSide>
          </Style.HeaderWrapper>

          <IconButton
            icon={icon.siren}
            label="Responder chamados"
            onClick={() => {
              if (ticketsToAnswer.length === 0) {
                toast.error('Selecione pelo menos um chamado.');
                return;
              }
              setModalChooseAnswerType(true);
            }}
          />
        </Style.Header>
        {showFilter && (
          <Style.FilterWrapper>
            <Input
              disabled={loading}
              label="Data inicial"
              type="date"
              value={initialCreatedAt}
              onChange={(evt) => {
                setInitialCreatedAt(evt.target.value);
              }}
            />
            <Input
              disabled={loading}
              label="Data final"
              type="date"
              value={finalCreatedAt}
              onChange={(evt) => {
                setFinalCreatedAt(evt.target.value);
              }}
            />
            <Select
              disabled={loading}
              selectPlaceholderValue={' '}
              label="Status"
              value={statusName}
              onChange={(evt) => {
                setStatusName(evt.target.value);
              }}
            >
              <option value="">Todos</option>
              {statusOptions.map(({ label, name }) => (
                <option key={name} value={name}>
                  {label}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              label="Filtrar"
              disable={onQuery}
              onClick={() => {
                setPage(1);
                findManyTickets(1);
              }}
            />
          </Style.FilterWrapper>
        )}

        {ticketsToAnswer.length > 0 && (
          <Style.SelectedTickets>
            <h5>Chamados selecionados:</h5>

            {ticketsToAnswer.map(
              ({ ticketNumber }, i) =>
                `#${ticketNumber}${i === ticketsToAnswer.length - 1 ? '' : ', '}`,
            )}
          </Style.SelectedTickets>
        )}

        {loading && (
          <LoadingWrapper minHeight="80vh">
            <DotSpinLoading />
          </LoadingWrapper>
        )}

        {!loading && tickets.length > 0 && (
          <Style.PaginationContainer>
            <Style.Wrapper>
              {tickets.map(
                ({ id, residentName, place, types, createdAt, ticketNumber, status }) => (
                  <Style.Card
                    key={id}
                    onClick={() => {
                      setSelectedTicketId(id);
                      setModalTicketDetailsOpen(true);
                    }}
                  >
                    <Style.CardHeader>
                      <h5>{`#${ticketNumber}`}</h5>

                      <Style.CardHeaderRightSide
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <ListTag
                          label={status.label}
                          backgroundColor={status.backgroundColor}
                          color={status.color}
                          fontWeight={500}
                          padding="2px 4px"
                          fontSize="12px"
                        />
                        {status.name === 'open' && (
                          <InputCheckbox
                            size="18px"
                            checked={ticketsToAnswer.some((e) => e.id === id)}
                            onChange={(evt) => {
                              const isChecked = evt.target.checked;
                              if (isChecked) {
                                setTicketsToAnswer((prev) => [...prev, { id, ticketNumber }]);
                              } else {
                                setTicketsToAnswer((prev) =>
                                  prev.filter(
                                    (ticket) =>
                                      ticket.id !== id || ticket.ticketNumber !== ticketNumber,
                                  ),
                                );
                              }
                            }}
                          />
                        )}
                      </Style.CardHeaderRightSide>
                    </Style.CardHeader>

                    <Style.CardRow>
                      <p className="p3">Morador</p>
                      <p className="p3">{residentName}</p>
                    </Style.CardRow>

                    <Style.CardRow>
                      <p className="p3">Local da Ocorrência</p>
                      <ListTag
                        label={place.label}
                        backgroundColor={theme.color.gray4}
                        color="#ffffff"
                        fontWeight={500}
                        padding="2px 4px"
                        fontSize="12px"
                      />
                    </Style.CardRow>

                    <Style.CardRow>
                      <p className="p3">Tipo da manutenção</p>
                      <TagsArray data={types.map(({ type }) => type.label)} />
                    </Style.CardRow>

                    <Style.CardRow>
                      <p className="p3">Data de abertura</p>
                      <p className="p3">{dateFormatter(createdAt)}</p>
                    </Style.CardRow>
                  </Style.Card>
                ),
              )}
            </Style.Wrapper>
            <Style.PaginationFooter>
              <Pagination
                totalCountOfRegister={count}
                currentPage={page}
                registerPerPage={take}
                onPageChange={(pageParam) => {
                  setPage(pageParam);
                  findManyTickets(pageParam);
                }}
              />
            </Style.PaginationFooter>
          </Style.PaginationContainer>
        )}
      </Style.Container>

      {!loading && tickets.length === 0 && (
        <Style.NoDataContainer>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhum chamado encontrado. </h3>
        </Style.NoDataContainer>
      )}
    </>
  );
};
