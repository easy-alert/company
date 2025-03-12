// REACT
import { useCallback, useEffect, useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useServiceTypes } from '@hooks/useServiceTypes';
import { useTicketPlaces } from '@hooks/useTicketPlaces';
import { useTicketStatus } from '@hooks/useTicketStatus';
import { useTicketApartments } from '@hooks/useTicketApartments';
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// SERVICES
import { getTicketsByBuildingNanoId } from '@services/apis/getTicketsByBuildingNanoId';
import { putTicketById } from '@services/apis/putTicketById';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { Skeleton } from '@components/Skeleton';
import { ListTag } from '@components/ListTag';
import { FormikInput } from '@components/Form/FormikInput';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';
import { formatDateString } from '@utils/dateFunctions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';

// COMPONENTS
import ModalTicketDetails from './ModalTicketDetails';
import { ModalCreateTicket } from './ModalCreateTicket';

// STYLES
import * as Style from './styles';

interface IKanbanTicket {
  title: string;
  tickets: ITicket[];
}

export interface ITicketFilter {
  buildings: string[];
  status: string[];
  places: string[];
  serviceTypes: string[];
  apartments: string[];
  startDate?: string;
  endDate?: string;
  seen: string;
}

function TicketsPage() {
  const { account } = useAuthContext();
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const { serviceTypes } = useServiceTypes({ buildingNanoId: 'all', page: 1, take: 10 });
  const { ticketPlaces } = useTicketPlaces({ placeId: 'all' });
  const { ticketStatus } = useTicketStatus({ statusName: 'all' });

  const [kanbanTickets, setKanbanTickets] = useState<IKanbanTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

  const [filter, setFilter] = useState<ITicketFilter>({
    buildings: [],
    status: [],
    places: [],
    serviceTypes: [],
    apartments: [],
    startDate: '',
    endDate: '',
    seen: '',
  });

  const { ticketApartments } = useTicketApartments({ buildingNanoId: filter.buildings });

  const [ticketDetailsModal, setTicketDetailsModal] = useState<boolean>(false);
  const [createTicketModal, setCreateTicketModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [ticketAccess, setTicketAccess] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleClearFilter = () => {
    setFilter({
      buildings: [],
      status: [],
      places: [],
      serviceTypes: [],
      apartments: [],
      startDate: '',
      endDate: '',
      seen: '',
    });
  };

  const handleCreateKanbanTickets = useCallback((responseTickets: ITicket[]) => {
    const openTickets = responseTickets
      .filter((ticket) => ticket.status?.name === 'open')
      .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
      .sort((a, b) => {
        if (a.seen === b.seen) return 0;

        return a.seen ? 1 : -1;
      });

    const inProgressTickets = responseTickets
      .filter((ticket) => ticket.status?.name === 'awaitingToFinish')
      .sort(
        (a, b) => new Date(b.updatedAt ?? '').getTime() - new Date(a.updatedAt ?? '').getTime(),
      );

    const finishedTickets = responseTickets
      .filter((ticket) => ticket.status?.name === 'finished')
      .sort(
        (a, b) => new Date(b.updatedAt ?? '').getTime() - new Date(a.updatedAt ?? '').getTime(),
      );

    const dismissedTickets = responseTickets
      .filter((ticket) => ticket.status?.name === 'dismissed')
      .sort(
        (a, b) => new Date(b.dismissedAt ?? '').getTime() - new Date(a.dismissedAt ?? '').getTime(),
      );

    const ticketsKanbanArray = [
      {
        title: 'Abertos',
        tickets: openTickets,
      },
      {
        title: 'Em execução',
        tickets: inProgressTickets,
      },
      {
        title: 'Concluídos',
        tickets: finishedTickets,
      },
      {
        title: 'Indeferidos',
        tickets: dismissedTickets,
      },
    ];

    setKanbanTickets(ticketsKanbanArray);
  }, []);

  // handle change functions
  const handleFilterChange = (key: keyof ITicketFilter, value: string) => {
    setFilter((prevState) => {
      const checkArray = Array.isArray(prevState[key]);
      const newFilter = { ...prevState, [key]: value };

      if (checkArray) {
        return {
          ...newFilter,
          [key]: [...(prevState[key] as string[]), value],
        };
      }

      return newFilter;
    });
  };

  const handleSelectedTicketIdChange = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const handleSeenLocalKanbanTicket = (ticketId: string) => {
    const updatedTickets = kanbanTickets.map((kanban) => ({
      ...kanban,
      tickets: kanban.tickets.map((kt) => (kt.id === ticketId ? { ...kt, seen: true } : kt)),
    }));

    setKanbanTickets(updatedTickets);
  };

  // api functions
  const handleGetTickets = async () => {
    try {
      setLoading(true);

      const response = await getTicketsByBuildingNanoId({
        filter,
      });

      if (response?.statusCode !== 403) setTicketAccess(true);

      handleCreateKanbanTickets(response.tickets);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleUpdateOneTicket = async (updatedTicket: ITicket) => {
    try {
      await putTicketById(updatedTicket);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };

  // modal functions
  const handleTicketDetailsModal = (modalState: boolean) => {
    setTicketDetailsModal(modalState);
  };

  const handleCreateTicketModal = (modalState: boolean) => {
    setCreateTicketModal(modalState);
  };

  useEffect(() => {
    handleGetTickets();
  }, [refresh]);

  return (
    <>
      {createTicketModal && (
        <ModalCreateTicket
          buildings={buildingsForSelect}
          handleCreateTicketModal={handleCreateTicketModal}
          handleRefresh={handleRefresh}
        />
      )}

      {ticketDetailsModal && (
        <ModalTicketDetails
          ticketId={selectedTicketId}
          userId={account?.User.id}
          handleTicketDetailsModal={handleTicketDetailsModal}
          handleRefresh={handleRefresh}
        />
      )}

      <Style.Container>
        <Style.Header>
          <Style.HeaderWrapper>
            <h2>Chamados</h2>
          </Style.HeaderWrapper>

          {ticketAccess && (
            <IconButton
              icon={icon.siren}
              label="Abrir chamado"
              permToCheck="tickets:create"
              onClick={() => handleCreateTicketModal(true)}
            />
          )}
        </Style.Header>

        <Style.FiltersContainer>
          <Formik
            initialValues={{
              buildings: [],
              status: [],
              places: [],
              serviceTypes: [],
              startDate: '',
              endDate: '',
              seen: '',
            }}
            onSubmit={async () => handleGetTickets()}
          >
            {({ errors, values, setFieldValue, touched }) => (
              <Form>
                <Style.FilterWrapper>
                  <Select
                    selectPlaceholderValue={filter.buildings.length > 0 ? ' ' : ''}
                    label="Edificação"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('buildings', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({
                          ...prevState,
                          buildings: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.buildings.length === 0}>
                      Todas
                    </option>

                    {buildingsForSelect.map((building) => (
                      <option
                        value={building.nanoId}
                        key={building.nanoId}
                        disabled={filter.buildings.some((b) => b === building.nanoId)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.apartments.length > 0 ? ' ' : ''}
                    disabled={ticketApartments.length === 0}
                    label="Apto/Bloco"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('apartments', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({
                          ...prevState,
                          apartments: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.apartments.length === 0}>
                      Todos
                    </option>

                    {ticketApartments.map((apartment) => (
                      <option
                        key={apartment.number}
                        value={apartment.number}
                        disabled={filter.apartments.some((a) => a === apartment.number)}
                      >
                        {apartment.number}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.places.length > 0 ? ' ' : ''}
                    label="Local"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('places', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({
                          ...prevState,
                          places: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.places.length === 0}>
                      Todos
                    </option>

                    {ticketPlaces.map((place) => (
                      <option
                        value={place.id}
                        key={place.id}
                        disabled={filter.places.some((p) => p === place.id)}
                      >
                        {place.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.serviceTypes.length > 0 ? ' ' : ''}
                    label="Tipo de serviço"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('serviceTypes', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({
                          ...prevState,
                          serviceTypes: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.serviceTypes.length === 0}>
                      Todos
                    </option>

                    {serviceTypes.map((type) => (
                      <option
                        value={type.id}
                        key={type.id}
                        disabled={filter.serviceTypes.some(
                          (serviceType) => serviceType === type.id,
                        )}
                      >
                        {type.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={filter.status.length > 0 ? ' ' : ''}
                    label="Status"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('status', e.target.value);

                      if (e.target.value === 'all') {
                        setFilter((prevState) => ({
                          ...prevState,
                          status: [],
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={filter.status.length === 0}>
                      Todos
                    </option>

                    {ticketStatus.map((status) => (
                      <option
                        value={status.name}
                        key={status.name}
                        disabled={filter.status.some((s) => s === status.name)}
                      >
                        {status.label}
                      </option>
                    ))}
                  </Select>

                  <FormikInput
                    label="Data inicial"
                    typeDatePlaceholderValue={values.startDate}
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={(e) => {
                      setFieldValue('startDate', e.target.value);
                      handleFilterChange('startDate', e.target.value);
                    }}
                    error={touched.startDate && errors.startDate ? errors.startDate : null}
                  />

                  <FormikInput
                    label="Data final"
                    typeDatePlaceholderValue={values.endDate}
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    onChange={(e) => {
                      setFieldValue('endDate', e.target.value);
                      handleFilterChange('endDate', e.target.value);
                    }}
                    error={touched.endDate && errors.endDate ? errors.endDate : null}
                  />
                </Style.FilterWrapper>

                <Style.FilterWrapperFooter>
                  <Style.FilterButtonWrapper>
                    <Button
                      type="button"
                      borderless
                      label="Limpar filtros"
                      onClick={() => {
                        setFieldValue('startDate', '');
                        setFieldValue('endDate', '');
                        handleClearFilter();
                      }}
                    />

                    <Button type="submit" label="Filtrar" disabled={loading} />
                  </Style.FilterButtonWrapper>

                  <Style.FilterTags>
                    {filter.buildings?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todas as edificações" />
                    ) : (
                      filter.buildings?.map((building) => (
                        <ListTag
                          key={building}
                          label={buildingsForSelect.find((b) => b.nanoId === building)?.name || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              buildings: prevState.buildings?.filter((b) => b !== building),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.status?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todos os status" />
                    ) : (
                      filter.status?.map((status) => (
                        <ListTag
                          key={status}
                          label={ticketStatus.find((s) => s.name === status)?.label || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              status: prevState.status?.filter((s) => s !== status),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.places?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todos os locais" />
                    ) : (
                      filter.places?.map((place) => (
                        <ListTag
                          key={place}
                          label={ticketPlaces.find((p) => p.id === place)?.label || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              places: prevState.places?.filter((p) => p !== place),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.serviceTypes?.length === 0 ? (
                      <ListTag
                        padding="4px 12px"
                        fontWeight={500}
                        label="Todos os tipos de serviço"
                      />
                    ) : (
                      filter.serviceTypes?.map((serviceType) => (
                        <ListTag
                          key={serviceType}
                          label={serviceTypes.find((s) => s.id === serviceType)?.label || ''}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              serviceTypes: prevState.serviceTypes?.filter(
                                (s) => s !== serviceType,
                              ),
                            }));
                          }}
                        />
                      ))
                    )}

                    {filter.apartments?.length === 0 ? (
                      <ListTag padding="4px 12px" fontWeight={500} label="Todos os apartamentos" />
                    ) : (
                      filter.apartments?.map((apartment) => (
                        <ListTag
                          key={apartment}
                          label={apartment}
                          padding="4px 12px"
                          fontWeight={500}
                          onClick={() => {
                            setFilter((prevState) => ({
                              ...prevState,
                              apartments: prevState.apartments?.filter((a) => a !== apartment),
                            }));
                          }}
                        />
                      ))
                    )}
                  </Style.FilterTags>
                </Style.FilterWrapperFooter>
              </Form>
            )}
          </Formik>
        </Style.FiltersContainer>

        <Style.Kanban>
          {kanbanTickets.map((kanbanTicket, i: number) => (
            <Style.KanbanCard key={kanbanTicket.title}>
              <Style.KanbanHeader>
                <h5>{kanbanTicket.title}</h5>
                <span>{kanbanTicket.tickets.length}</span>
              </Style.KanbanHeader>

              {loading && (
                <>
                  {(i === 1 || i === 2 || i === 3) && (
                    <Style.KanbanTicketWrapper>
                      <Skeleton />
                    </Style.KanbanTicketWrapper>
                  )}

                  {(i === 0 || i === 1 || i === 2 || i === 3) && (
                    <Style.KanbanTicketWrapper>
                      <Skeleton />
                    </Style.KanbanTicketWrapper>
                  )}

                  {(i === 0 || i === 2 || i === 3) && (
                    <Style.KanbanTicketWrapper>
                      <Skeleton />
                    </Style.KanbanTicketWrapper>
                  )}

                  {i === 3 && (
                    <Style.KanbanTicketWrapper>
                      <Skeleton />
                    </Style.KanbanTicketWrapper>
                  )}
                </>
              )}

              {!loading &&
                kanbanTicket.tickets.length > 0 &&
                kanbanTicket.tickets.map((ticket) => (
                  <Style.KanbanTicketWrapper
                    key={ticket.id}
                    onClick={() => {
                      if (!ticket.seen) {
                        handleUpdateOneTicket({
                          id: ticket.id,
                          seen: true,
                        }).then(() => handleSeenLocalKanbanTicket(ticket.id));
                      }

                      handleSelectedTicketIdChange(ticket.id);
                      handleTicketDetailsModal(true);
                    }}
                  >
                    <Style.KanbanTicketInfo statusBgColor={ticket?.status?.backgroundColor}>
                      <Style.KanbanTicketHeader>
                        <Style.KanbanTicketHeaderInfo>
                          <Style.KanbanTicketNumber>
                            #{ticket.ticketNumber}
                          </Style.KanbanTicketNumber>

                          <Style.KanbanTicketBuildingName>
                            - {ticket.building?.name}
                          </Style.KanbanTicketBuildingName>
                        </Style.KanbanTicketHeaderInfo>

                        {!ticket?.seen && <Style.KanbanTicketNewTag />}
                      </Style.KanbanTicketHeader>

                      <Style.KanbanTicketGrid>
                        <Style.KanbanTicketGridBox>
                          <Style.KanbanTicketTitle>Morador</Style.KanbanTicketTitle>

                          <Style.KanbanTicketDescription>
                            {ticket.residentName}
                          </Style.KanbanTicketDescription>
                        </Style.KanbanTicketGridBox>

                        <Style.KanbanTicketGridBox>
                          <Style.KanbanTicketTitle>Tipo de assistência</Style.KanbanTicketTitle>

                          <Style.KanbanTicketListTags>
                            {ticket.types?.map((type) => (
                              <ListTag
                                key={type.type.id}
                                label={type.type.label}
                                color={type.type.color}
                                backgroundColor={type.type.backgroundColor}
                                padding="2px 0.5rem"
                              />
                            ))}
                          </Style.KanbanTicketListTags>
                        </Style.KanbanTicketGridBox>

                        <Style.KanbanTicketGridBox>
                          <Style.KanbanTicketTitle>Local da ocorrência</Style.KanbanTicketTitle>

                          <Style.KanbanTicketDescription>
                            {ticket.place?.label}
                          </Style.KanbanTicketDescription>
                        </Style.KanbanTicketGridBox>

                        <Style.KanbanTicketGridBox>
                          <Style.KanbanTicketTitle>Data de abertura</Style.KanbanTicketTitle>

                          <Style.KanbanTicketDescription>
                            {ticket.createdAt &&
                              formatDateString(ticket.createdAt, 'dd/MM/yyyy - HH:mm')}
                          </Style.KanbanTicketDescription>
                        </Style.KanbanTicketGridBox>
                      </Style.KanbanTicketGrid>
                    </Style.KanbanTicketInfo>
                  </Style.KanbanTicketWrapper>
                ))}
            </Style.KanbanCard>
          ))}
        </Style.Kanban>
      </Style.Container>
    </>
  );
}

export default TicketsPage;
