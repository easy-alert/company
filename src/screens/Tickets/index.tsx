// REACT
import { useEffect, useState } from 'react';

// LIBS
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { ModalCreateOccasionalMaintenance } from '@components/ModalCreateOccasionalMaintenance';
import { Image } from '@components/Image';
import { ListTag } from '@components/ListTag';
import { TagsArray } from '@components/TagsArray';
import { InputCheckbox } from '@components/Inputs/InputCheckbox';
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { Select } from '@components/Inputs/Select';
import { Input } from '@components/Inputs/Input';
import { Pagination } from '@components/Pagination';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';

// GLOBAL UTILS
import { catchHandler, dateFormatter } from '@utils/functions';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// COMPONENTS
import { ModalTicketDetails } from './ModalTicketDetails';
import { ModalChooseAnswerType } from './ModalChooseAnswerType';
import { ModalConnectTicketToExistingOccasionalMaintenances } from './ModalConnectTicketToExistingOccasionalMaintenances';

// STYLES
import * as Style from './styles';

// TYPES
import type { IBuildingOptions, IStatusOptions, ITicket, ITicketsToAnswer } from './types';

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
  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] =
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

  const resetSelectedTickets = () => {
    setTicketsToAnswer([]);
  };

  const handleModalChooseAnswerType = (modalState: boolean) => {
    setModalChooseAnswerType(modalState);
  };

  const handleModalCreateOccasionalMaintenance = (modalState: boolean) => {
    setModalCreateOccasionalMaintenance(modalState);
  };

  const handleModalConnectTicketToExistingOccasionalMaintenances = (modalState: boolean) => {
    setModalConnectTicketToExistingOccasionalMaintenances(modalState);
  };

  const ticketsToAnswerString = `Chamados selecionados: ${ticketsToAnswer
    .map(({ ticketNumber }) => `#${ticketNumber}`)
    .join(', ')}`;

  const ticketIds = ticketsToAnswer.map(({ id }) => id);

  useEffect(() => {
    findBuildingsForSelect();
  }, []);

  useEffect(() => {
    if (buildingNanoId) {
      findManyTickets();
    }
  }, [buildingNanoId]);

  return (
    <>
      {modalTicketDetailsOpen && (
        <ModalTicketDetails
          setModal={setModalTicketDetailsOpen}
          ticketId={selectedTicketId}
          onThenRequest={findManyTickets}
        />
      )}

      {modalChooseAnswerType && (
        <ModalChooseAnswerType
          ticketsToAnswer={ticketsToAnswerString}
          handleModalChooseAnswerType={handleModalChooseAnswerType}
          handleModalCreateOccasionalMaintenance={handleModalCreateOccasionalMaintenance}
          handleModalConnectTicketToExistingOccasionalMaintenances={
            handleModalConnectTicketToExistingOccasionalMaintenances
          }
        />
      )}

      {modalCreateOccasionalMaintenance && (
        <ModalCreateOccasionalMaintenance
          externalBuildingId={buildingId}
          ticketsIds={ticketIds}
          ticketsToAnswer={ticketsToAnswerString}
          handleGetBackgroundData={findManyTickets}
          handleResetTickets={resetSelectedTickets}
          handleModalCreateOccasionalMaintenance={handleModalCreateOccasionalMaintenance}
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
          <Style.HeaderLeftSide>
            <h2>Chamados</h2>

            <Select
              id="customFilterForChecklist"
              disabled={loading}
              selectPlaceholderValue=" "
              value={buildingNanoId}
              onChange={(evt) => {
                resetSelectedTickets();
                const building = buildingOptions.find(({ nanoId }) => nanoId === evt.target.value);
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
