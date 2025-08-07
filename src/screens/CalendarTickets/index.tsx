// REACT
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

// LIBS
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventContentArg } from '@fullcalendar/core';
import { Form, Formik } from 'formik';

// CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

// SERVICES
import { getCalendarTicket } from '@services/apis/getCalendarTicket';

// GLOBAL COMPONENTS
import { FormikSelect } from '@components/Form/FormikSelect';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';

// GLOBAL STYLES
import ModalTicketDetails from '@screens/Tickets/ModalTicketDetails';
import * as Style from './styles';

// COMPONENTS

const handleTranslate = (value: string) => {
  const translations: Record<string, string> = {
    open: 'em aberto',
    awaitingtofinish: 'em execução',
    finished: 'concluída',
    dismissed: 'indeferido',
  };
  return translations[value.toLowerCase()] || value;
};

const renderEventContent = ({ event, view }: EventContentArg) => {
  const { building, assistanceTypes = [], place, ticketNumber } = event.extendedProps;
  const isWeekView = view.type === 'dayGridWeek';

  return (
    <Style.CustomEvent
      className={`status-${(event.extendedProps.status || event.title || '')
        .toLowerCase()
        .replace(/\s/g, '-')}`}
    >
      {!isWeekView ? (
        <span style={{ fontWeight: 600 }}>{event.title}</span>
      ) : (
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Style.EventInfoRow>
            <p>{building}</p>
            <Style.EventTicketNumber>#{ticketNumber}</Style.EventTicketNumber>
          </Style.EventInfoRow>
          <span>{place || 'Não informado'}</span>
          <span>
            {assistanceTypes.length > 0
              ? assistanceTypes.map((type: any) => (
                  <Style.AssistanceTypeTag
                    key={type.label}
                    color={type.color}
                    background={type.backgroundColor}
                  >
                    {type.label}
                  </Style.AssistanceTypeTag>
                ))
              : 'Não informado'}
          </span>
        </div>
      )}
    </Style.CustomEvent>
  );
};

export const CalendarTickets = () => {
  const { account } = useContext(AuthContext);
  const calendarRef = useRef<FullCalendar>(null);

  const [calendarState, setCalendarState] = useState({
    date: new Date(),
    currentView: 'dayGridMonth',
    buildingIds: [] as string[],
  });

  const [dataState, setDataState] = useState({
    events: [] as any[],
    buildings: [] as { id: string; name: string }[],
    selectedTicket: null as any,
    showModal: false,
  });

  const handleFetchCalendarData = useCallback(async () => {
    if (!account?.Company?.id) return;

    const { date, currentView, buildingIds } = calendarState;

    const data = await getCalendarTicket({
      companyId: account.Company.id,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      buildingIds: buildingIds.length > 0 ? buildingIds : undefined,
    });

    const buildings = data.buildings || [];
    let calendarEvents: any[] = [];

    if (currentView === 'dayGridMonth') {
      (data.Days || []).forEach((day: any) => {
        const statusMap: Record<string, number> = {};

        day.tickets.forEach((ticket: any) => {
          const statusKey = ticket.statusName.toLowerCase();
          statusMap[statusKey] = (statusMap[statusKey] ?? 0) + 1;
        });

        Object.entries(statusMap).forEach(([statusKey, count]) => {
          calendarEvents.push({
            id: `${day.date}-${statusKey}`,
            title: `${count} ${handleTranslate(statusKey)}`,
            start: day.date,
            allDay: true,
            status: statusKey,
          });
        });
      });
    } else {
      calendarEvents = (data.Days || []).flatMap((day: any) =>
        day.tickets.map((ticket: any) => ({
          id: ticket.id,
          title: handleTranslate(ticket.statusName),
          start: new Date(ticket.createdAt),
          allDay: true,
          status: ticket.statusName?.toLowerCase(),
          building: ticket.building?.name,
          place: ticket.place?.label,
          ticketNumber: ticket.ticketNumber,
          assistanceTypes: Array.isArray(ticket.types)
            ? ticket.types.map((t: any) => ({
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
      buildings,
    }));
  }, [account?.Company?.id, calendarState]);

  useEffect(() => {
    handleFetchCalendarData();
  }, [handleFetchCalendarData]);

  const handleEventClick = (info: any) => {
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi?.view.type === 'dayGridMonth' && info.event.start) {
      calendarApi.changeView('dayGridWeek', info.event.start);
    } else if (calendarApi?.view.type === 'dayGridWeek') {
      setDataState((prev) => ({
        ...prev,
        selectedTicket: { id: info.event.id },
        showModal: true,
      }));
    }
  };

  return (
    <Style.Container>
      <Style.Header>
        <h2>Calendário chamados</h2>
        <Formik
          initialValues={{ buildings: [] }}
          onSubmit={async () => {
            handleFetchCalendarData();
          }}
        >
          {() => (
            <Form>
              <Style.FiltersContainer>
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
                        } else {
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
                      {dataState.buildings.map((building) => (
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
                        handleFetchCalendarData();
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
                        const building = dataState.buildings.find((b) => b.id === buildingId);
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
              </Style.FiltersContainer>
            </Form>
          )}
        </Formik>
      </Style.Header>

      <Style.CalendarWrapper
        view={calendarState.currentView}
        disableCalendarNextButton={false}
        yearChangeloading={false}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={calendarState.date}
          locale={ptBrLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridYear',
          }}
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            prev: 'Anterior',
            next: 'Próximo',
          }}
          views={{
            dayGridMonth: { buttonText: 'Mês' },
            dayGridWeek: { buttonText: 'Semana' },
            dayGridYear: {
              type: 'dayGrid',
              duration: { years: 1 },
              buttonText: 'Ano',
            },
          }}
          events={dataState.events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          datesSet={(arg) => {
            setCalendarState((prev) => ({
              ...prev,
              date: arg.start,
              currentView: arg.view.type,
            }));
          }}
          selectable
          dayMaxEvents={false}
          eventDisplay="block"
          height={750}
        />
      </Style.CalendarWrapper>

      {dataState.showModal && dataState.selectedTicket?.id && (
        <ModalTicketDetails
          ticketId={dataState.selectedTicket.id}
          userId={account?.User?.id}
          handleTicketDetailsModal={(show) =>
            setDataState((prev) => ({ ...prev, showModal: show }))
          }
        />
      )}
    </Style.Container>
  );
};
