import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';

// CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// COMPONENTS
import { Calendar as CalendarComponent } from '@components/Calendar';
import { ModalTicketDetails } from '@components/TicketModals/ModalTicketDetails';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';

// STYLES
import * as Style from './styles';

import { getUnifiedCalendarMaintenances, getUnifiedCalendarTickets } from './functions';
import { renderEventContent as ticketEventContent } from '../CalendarTickets';

function getMaintenanceBackground(status: string) {
  if (status === 'expired') {
    return 'linear-gradient(90deg, #FF3508 0%, #FF3508 6px, #FAFAFA 6px, #FAFAFA 100%)';
  }
  if (status === 'pending') {
    return 'linear-gradient(90deg, #FFB200 0%, #FFB200 6px, #FAFAFA 6px, #FAFAFA 100%)';
  }
  return 'linear-gradient(90deg, #34B53A 0%, #34B53A 6px, #FAFAFA 6px, #FAFAFA 100%)';
}

function unifiedEventContent(arg: any) {
  if (arg.event.extendedProps.type === 'maintenance') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: getMaintenanceBackground(arg.event.extendedProps.status),
          color: 'black',
          borderRadius: 8,
          padding: '2px 8px',
          fontWeight: 500,
          fontSize: 13,
          height: 24,
        }}
      >
        <span>{arg.event.title}</span>
      </div>
    );
  }
  return ticketEventContent(arg);
}

export const CalendarUnified = () => {
  const { account } = useContext(AuthContext);
  const calendarRef = useRef<FullCalendar>(null);
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: false });

  const [modalTicketDetails, setModalTicketDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{ id: string } | null>(null);

  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState(false);
  const [modalAdditionalInformations, setModalAdditionalInformations] = useState<any>(null);
  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');

  const [calendarState, setCalendarState] = useState<{
    date: Date;
    currentView: string;
    buildingIds: string[];
  }>({
    date: new Date(),
    currentView: 'dayGridMonth',
    buildingIds: [],
  });

  const [dataState, setDataState] = useState<{ events: any[] }>({ events: [] });

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
  const handleEventClick = (info: EventClickArg) => {
    const eventType = info.event.extendedProps.type;

    if (eventType === 'maintenance') {
      const event = info.event.extendedProps;
      const calendarApi = calendarRef.current?.getApi();

      if (calendarApi?.view.type === 'dayGridMonth' && info.event.start) {
        calendarApi.changeView('dayGridWeek', info.event.start);
        return;
      }

      setMaintenanceHistoryId(event.id);
      setModalAdditionalInformations({
        id: event.id,
        expectedNotificationDate: event.expectedNotificationDate,
        isFuture: event.isFuture,
        expectedDueDate: event.expectedDueDate,
      });

      if (
        (event.status === 'completed' || event.status === 'overdue' || event.isFuture) &&
        event.id
      ) {
        setModalMaintenanceDetails(true);
      } else if (!event.isFuture && event.id) {
        setModalMaintenanceReportSend(true);
      }
    } else if (eventType === 'ticket') {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi?.view.type === 'dayGridMonth' && info.event.start) {
        calendarApi.changeView('dayGridWeek', info.event.start);
      } else if (calendarApi?.view.type === 'dayGridWeek') {
        setSelectedTicket({ id: info.event.id });
        setModalTicketDetails(true);
      }
    }
  };
  const handleGetCalendarEvents = useCallback(async () => {
    if (!account?.Company?.id) return;

    const { date, currentView, buildingIds } = calendarState;

    const calendarTypeMap: Record<string, 'month' | 'week' | 'work_week' | 'day' | 'agenda'> = {
      dayGridMonth: 'month',
      dayGridWeek: 'week',
      timeGridWeek: 'week',
      timeGridDay: 'day',
      listMonth: 'agenda',
      month: 'month',
      week: 'week',
      day: 'day',
      agenda: 'agenda',
    };
    const mappedCalendarType = calendarTypeMap[currentView] ?? 'month';

    const [tickets, maintenances] = await Promise.all([
      getUnifiedCalendarTickets({
        companyId: account.Company.id,
        year: date.getFullYear(),
        month: currentView === 'dayGridYear' ? undefined : date.getMonth() + 1,
        buildingIds: buildingIds.length > 0 ? buildingIds : undefined,
        currentView,
      }),
      getUnifiedCalendarMaintenances({
        buildingIds: buildingIds.length > 0 ? buildingIds : undefined,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        calendarType: mappedCalendarType,
      }),
    ]);

    setDataState({ events: [...tickets, ...maintenances] });
  }, [account?.Company?.id, calendarState]);

  useEffect(() => {
    handleGetCalendarEvents();
  }, [calendarState, handleGetCalendarEvents]);

  return (
    <Style.Container>
      <CalendarComponent
        ref={calendarRef}
        events={dataState.events}
        eventContent={unifiedEventContent}
        eventClick={handleEventClick}
        initialDate={calendarState.date}
        initialView={calendarState.currentView}
        onDatesSet={handleDatesSet}
        height={750}
        view={calendarState.currentView}
        disableCalendarNextButton={false}
        yearChangeloading={false}
      />

      {modalTicketDetails && selectedTicket && (
        <ModalTicketDetails
          ticketId={selectedTicket.id}
          userId={account?.User?.id}
          handleTicketDetailsModal={setModalTicketDetails}
        />
      )}

      {modalMaintenanceReportSend && (
        <ModalMaintenanceReportSend
          maintenanceHistoryId={maintenanceHistoryId}
          refresh={false}
          handleModals={(_, state) => setModalMaintenanceReportSend(state)}
          handleRefresh={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        />
      )}

      {modalMaintenanceDetails && (
        <ModalMaintenanceDetails
          modalAdditionalInformations={modalAdditionalInformations}
          handleModals={(_, state) => setModalMaintenanceDetails(state)}
          handleRefresh={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
          handleQuery={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        />
      )}
    </Style.Container>
  );
};
