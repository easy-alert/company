// REACT
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

// LIBS
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventContentArg } from '@fullcalendar/core';

// CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

// SERVICES
import { getCalendarCalled } from '@services/apis/getCalendarCalled';

// COMPONENTS
import ModalTicketDetails from '@screens/Tickets/ModalTicketDetails';

// STYLES
import * as Style from './styles';

const statusLabel: Record<string, string> = {
  open: 'em aberto',
  awaitingtofinish: 'em execucao',
  finished: 'concluidas',
  dismissed: 'indeferido',
};

const traduzStatus = (status: string): string => statusLabel[status.toLowerCase()];

const renderEventContent = ({ event, view }: EventContentArg) => {
  const { building, assistanceTypes = [], place, ticketNumber } = event.extendedProps;
  const isWeekView = view.type === 'dayGridWeek';

  return (
    <div
      className={`custom-event status-${(event.extendedProps.status || event.title || '')
        .toLowerCase()
        .replace(/\s/g, '-')}`}
    >
      <div className="custom-event-bar" />
      {!isWeekView ? (
        <span style={{ fontWeight: 600 }}>{event.title}</span>
      ) : (
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Style.EventInfoRow>
            <Style.EventBuilding>{building}</Style.EventBuilding>
            <Style.EventTicketNumber>#{ticketNumber}</Style.EventTicketNumber>
          </Style.EventInfoRow>
          <span>{place || 'Não informado'}</span>
          <span>
            {assistanceTypes.length > 0
              ? assistanceTypes.map((type: any) => (
                  <span
                    key={type.label}
                    style={{
                      color: type.color,
                      background: type.backgroundColor,
                      borderRadius: 4,
                      padding: '0 6px',
                      marginRight: 4,
                      fontWeight: 600,
                      fontSize: 12,
                      display: 'inline-block',
                    }}
                  >
                    {type.label}
                  </span>
                ))
              : 'Não informado'}
          </span>
        </div>
      )}
    </div>
  );
};

export const CalendarCalled = () => {
  const { account } = useContext(AuthContext);
  const calendarRef = useRef<FullCalendar>(null);

  const [calendarState, setCalendarState] = useState({
    date: new Date(),
    currentView: 'dayGridMonth',
    buildingId: 'none',
  });

  const [dataState, setDataState] = useState({
    events: [] as any[],
    buildings: [] as { id: string; name: string }[],
    selectedTicket: null as any,
    showModal: false,
  });

  const fetchCalendarData = useCallback(async () => {
    if (!account?.Company?.id) return;

    const { date, currentView, buildingId } = calendarState;

    const data = await getCalendarCalled({
      companyId: account.Company.id,
      year: date.getFullYear(),
      buildingId: buildingId !== 'none' ? buildingId : undefined,
    });

    const buildings = data.buildings || [];
    let calendarEvents: any[] = [];

    if (currentView === 'dayGridMonth') {
      (data.Days || []).forEach((day: any) => {
        const statusMap: Record<string, number> = {};

        day.tickets.forEach((ticket: any) => {
          const status = traduzStatus(ticket.statusName);
          statusMap[status] = (statusMap[status] ?? 0) + 1;
        });

        Object.entries(statusMap).forEach(([status, count]) => {
          calendarEvents.push({
            id: `${day.date}-${status}`,
            title: `${count} ${status}`,
            start: day.date,
            allDay: true,
            status,
          });
        });
      });
    } else {
      calendarEvents = (data.Days || []).flatMap((day: any) =>
        day.tickets.map((ticket: any) => ({
          id: ticket.id,
          title: traduzStatus(ticket.statusName),
          start: new Date(ticket.createdAt),
          allDay: true,
          status: traduzStatus(ticket.statusName),
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
    fetchCalendarData();
  }, [fetchCalendarData]);

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
        <select
          value={calendarState.buildingId}
          onChange={(e) => setCalendarState((prev) => ({ ...prev, buildingId: e.target.value }))}
        >
          <option value="none" hidden>
            Selecione
          </option>
          <option value="">Todas</option>
          {dataState.buildings.map((building) => (
            <option value={building.id} key={building.id}>
              {building.name}
            </option>
          ))}
        </select>
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
