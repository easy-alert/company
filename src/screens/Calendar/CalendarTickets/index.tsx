import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';

// LIBS
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';

// CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// SERVICES
import { getCalendarTicket } from '@services/apis/getCalendarTicket';

// GLOBAL COMPONENTS
import { FormikSelect } from '@components/Form/FormikSelect';
import { Button } from '@components/Buttons/Button';
import { IconButton } from '@components/Buttons/IconButton';
import { ModalTicketDetails } from '@components/TicketModals/ModalTicketDetails';
import { ListTag } from '@components/ListTag';
import { Calendar } from '@components/Calendar';

// GLOBAL UTILS
import { handleTranslate } from '@utils/handleTranslate';

// GLOBAL STYLES
import * as CalendarStyle from '@components/Calendar/styles';

// GLOBAL ASSETS
import IconFilter from '@assets/icons/IconFilter';

// GLOBAL TYPES
import type {
  ICalendarDay,
  ICalendarEvent,
  ICalendarTicket,
  IResponseGetCalendarTicket,
} from '@customTypes/ICalendarTicket';

// STYLES
import * as Style from './styles';

export const renderEventContent = (arg: EventContentArg, background?: string) => {
  const { event, view } = arg;
  const {
    building,
    assistanceTypes = [],
    place,
    ticketNumber,
    status,
  } = event.extendedProps as ICalendarEvent;
  const isWeekView = view.type === 'dayGridWeek';

  return (
    <CalendarStyle.CustomEvent
      className={`status-${(status || event.title || '').toLowerCase().replace(/\s/g, '-')}`}
      style={{ background }}
    >
      {!isWeekView ? (
        <span
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 4,
            lineHeight: 1.2,
          }}
        >
          <span style={{ wordBreak: 'break-word', flex: 1 }}>{event.title}</span>
          {ticketNumber && (
            <CalendarStyle.EventTicketNumber style={{ marginLeft: 4, whiteSpace: 'nowrap' }}>
              #{ticketNumber}
            </CalendarStyle.EventTicketNumber>
          )}
        </span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 2px' }}>
          <CalendarStyle.EventInfoRow>
            <p>{building}</p>
            <CalendarStyle.EventTicketNumber style={{ marginLeft: 6, whiteSpace: 'nowrap' }}>
              #{ticketNumber}
            </CalendarStyle.EventTicketNumber>
          </CalendarStyle.EventInfoRow>
          <span>{place || 'Não informado'}</span>
          <span>
            {assistanceTypes.length > 0
              ? assistanceTypes.map((type) => (
                  <CalendarStyle.AssistanceTypeTag
                    key={type.label}
                    color={type.color}
                    background={type.backgroundColor}
                  >
                    {type.label}
                  </CalendarStyle.AssistanceTypeTag>
                ))
              : 'Não informado'}
          </span>
        </div>
      )}
    </CalendarStyle.CustomEvent>
  );
};

export const CalendarTickets = () => {
  const { account } = useContext(AuthContext);
  const calendarRef = useRef<FullCalendar>(null);
  const { buildingsForSelect } = useBuildingsForSelect({
    checkPerms: false,
  });

  const [calendarState, setCalendarState] = useState<{
    date: Date;
    currentView: string;
    buildingIds: string[];
  }>({
    date: new Date(),
    currentView: 'dayGridMonth',
    buildingIds: [],
  });

  const [modalTicketDetails, setModalTicketDetails] = useState(false);

  const [dataState, setDataState] = useState<{
    events: ICalendarEvent[];
    selectedTicket: { id: string } | null;
    showModal: boolean;
  }>({
    events: [],
    selectedTicket: null,
    showModal: false,
  });

  const [showFilter, setShowFilter] = useState(false);

  const handleModalTicketDetails = (state: boolean) => {
    setModalTicketDetails(state);
  };

  const handleGetCalendarTicket = useCallback(async () => {
    if (!account?.Company?.id) return;

    const { date, currentView, buildingIds } = calendarState;

    const data: IResponseGetCalendarTicket = await getCalendarTicket({
      companyId: account.Company.id,
      year: date.getFullYear(),
      month: currentView === 'dayGridYear' ? undefined : date.getMonth() + 1,
      buildingIds: buildingIds.length > 0 ? buildingIds : undefined,
    });

    let calendarEvents: ICalendarEvent[] = [];

    if (currentView === 'dayGridMonth') {
      (data.Days || []).forEach((day: ICalendarDay) => {
        const statusMap: Record<string, number> = {};

        day.tickets.forEach((ticket: ICalendarTicket) => {
          statusMap[ticket.statusName] = (statusMap[ticket.statusName] ?? 0) + 1;
        });

        Object.entries(statusMap).forEach(([statusKey, count]) => {
          calendarEvents.push({
            id: `${day.date}-${statusKey}`,
            title: `${count} ${handleTranslate({
              key: statusKey,
              plural: true,
              alternative: true,
            })}`,
            start: day.date,
            allDay: true,
            status: statusKey,
          });
        });
      });
    } else {
      calendarEvents = (data.Days || []).flatMap((day: ICalendarDay) =>
        day.tickets.map((ticket: ICalendarTicket) => ({
          id: ticket.id,
          title: handleTranslate({ key: ticket.statusName, plural: true, alternative: true }),
          start: new Date(ticket.createdAt),
          allDay: true,
          status: ticket.statusName,
          building: ticket.building?.name,
          place: ticket.place?.label,
          ticketNumber: ticket.ticketNumber,
          assistanceTypes: Array.isArray(ticket.types)
            ? ticket.types.map((t) => ({
                label: t.type.label,
                color: t.type.color,
                backgroundColor: t.type.backgroundColor,
              }))
            : [],
        })),
      );
    }

    setDataState((prev) => ({
      ...prev,
      events: calendarEvents,
    }));
  }, [account?.Company?.id, calendarState]);

  const handleEventClick = (info: EventClickArg) => {
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi?.view.type === 'dayGridMonth' && info.event.start) {
      calendarApi.changeView('dayGridWeek', info.event.start);
    } else if (calendarApi?.view.type === 'dayGridWeek') {
      handleModalTicketDetails(true);
      setDataState((prev) => ({
        ...prev,
        selectedTicket: { id: info.event.id },
      }));
    }
  };

  const handleDatesSet = (arg: { start: Date; view: { type: string; currentStart?: Date } }) => {
    let newDate = arg.view.currentStart ?? arg.start;
    if (arg.view.type === 'dayGridYear') {
      const yearValue = arg.view.currentStart?.getFullYear() ?? new Date().getFullYear();
      newDate = new Date(yearValue, 0, 1);
    }
    setCalendarState((prev) => ({
      ...prev,
      date: newDate,
      currentView: arg.view.type,
    }));
  };

  useEffect(() => {
    handleGetCalendarTicket();
  }, [calendarState]);

  return (
    <>
      {modalTicketDetails && dataState.selectedTicket?.id && (
        <ModalTicketDetails
          ticketId={dataState.selectedTicket.id}
          userId={account?.User?.id}
          handleTicketDetailsModal={handleModalTicketDetails}
        />
      )}

      <Style.Container>
        <Style.Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Calendário chamados</h2>

            <IconButton
              label="Filtros"
              icon={<IconFilter strokeColor="primary" />}
              onClick={() => setShowFilter(!showFilter)}
            />
          </div>
        </Style.Header>

        {showFilter && (
          <Style.FiltersContainer>
            <Formik
              initialValues={{ buildings: calendarState.buildingIds }}
              enableReinitialize
              onSubmit={async () => handleGetCalendarTicket()}
            >
              {() => (
                <Form>
                  <Style.FilterWrapper>
                    <div>
                      <FormikSelect
                        id="building-select"
                        label="Edificação"
                        selectPlaceholderValue={' '}
                        value=""
                        disabled={false}
                        onChange={(e) => {
                          const selected = e.target.value;
                          if (selected === 'all') {
                            setCalendarState((prev) => ({ ...prev, buildingIds: [] }));
                          } else if (!calendarState.buildingIds.includes(selected)) {
                            setCalendarState((prev) => ({
                              ...prev,
                              buildingIds: [...prev.buildingIds, selected],
                            }));
                          }
                        }}
                      >
                        <option value="" disabled hidden>
                          Selecione
                        </option>
                        <option value="all" disabled={calendarState.buildingIds.length === 0}>
                          Todas
                        </option>
                        {buildingsForSelect.map((building) => (
                          <option
                            key={building.id}
                            value={building.id}
                            disabled={calendarState.buildingIds.includes(building.id)}
                          >
                            {building.name}
                          </option>
                        ))}
                      </FormikSelect>
                    </div>

                    <Style.FilterButtonWrapper>
                      <Button
                        type="button"
                        label="Limpar filtros"
                        borderless
                        textColor="primary"
                        onClick={() => {
                          setCalendarState((prev) => ({ ...prev, buildingIds: [] }));
                          handleGetCalendarTicket();
                        }}
                      />
                      <Button type="submit" label="Filtrar" bgColor="primary" />
                    </Style.FilterButtonWrapper>
                  </Style.FilterWrapper>

                  <Style.FilterWrapperFooter>
                    <Style.FilterTags>
                      {calendarState.buildingIds.length === 0 ? (
                        <ListTag
                          label="Todas as edificações"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        calendarState.buildingIds.map((buildingId) => {
                          const building = buildingsForSelect.find((b) => b.id === buildingId);
                          return (
                            <ListTag
                              key={buildingId}
                              label={building?.name || ''}
                              color="white"
                              backgroundColor="primaryM"
                              fontWeight={500}
                              padding="4px 12px"
                              onClick={() =>
                                setCalendarState((prev) => ({
                                  ...prev,
                                  buildingIds: prev.buildingIds.filter((id) => id !== buildingId),
                                }))
                              }
                            />
                          );
                        })
                      )}
                    </Style.FilterTags>
                  </Style.FilterWrapperFooter>
                </Form>
              )}
            </Formik>
          </Style.FiltersContainer>
        )}

        <Calendar
          ref={calendarRef}
          events={dataState.events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          initialDate={calendarState.date}
          initialView={calendarState.currentView}
          onDatesSet={handleDatesSet}
          height={750}
          view={calendarState.currentView}
          disableCalendarNextButton={false}
          yearChangeloading={false}
        />
      </Style.Container>
    </>
  );
};
