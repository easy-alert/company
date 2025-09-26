import { getCalendarTicket } from '@services/apis/getCalendarTicket';
import { handleTranslate } from '@utils/handleTranslate';
import type {
  ICalendarDay,
  ICalendarEvent,
  ICalendarTicket,
  IResponseGetCalendarTicket,
} from '@customTypes/ICalendarTicket';
import { ICalendarView } from '../CalendarMaintenance/types';
import { requestCalendarData } from '../CalendarMaintenance/functions';

export const getUnifiedCalendarTickets = async ({
  companyId,
  year,
  month,
  buildingIds,
  currentView,
}: {
  companyId: string;
  year: number;
  month?: number;
  buildingIds?: string[];
  currentView: string;
}): Promise<ICalendarEvent[]> => {
  const data: IResponseGetCalendarTicket = await getCalendarTicket({
    companyId,
    year,
    month,
    buildingIds,
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
        extendedProps: {
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
          type: 'ticket',
          id: ticket.id,
          status: ticket.statusName,
        },
      })),
    );
  }

  return calendarEvents;
};

export const getUnifiedCalendarMaintenances = async ({
  buildingIds,
  year,
  month,
  calendarType,
}: {
  buildingIds?: string[];
  year: number;
  month: number;
  calendarType: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
}) => {
  let maintenancesMonth: ICalendarView[] = [];
  let maintenancesWeek: ICalendarView[] = [];

  await requestCalendarData({
    buildingIds: buildingIds || [],
    yearToRequest: year,
    monthToRequest: month,
    calendarType,
    setLoading: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    setMaintenancesMonthView: (arr: ICalendarView[]) => {
      maintenancesMonth = arr;
    },
    setMaintenancesWeekView: (arr: ICalendarView[]) => {
      maintenancesWeek = arr;
    },
    setMaintenancesDisplay: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    setYearChangeLoading: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  });

  const mapEvent = (event: ICalendarView) => {
    let title = 'Manutenção';
    if (event.title && typeof event.title === 'string' && event.title.trim() !== '') {
      title = event.title;
    } else if (event.element) {
      title = event.element;
    } else if (event.status) {
      title = event.status.charAt(0).toUpperCase() + event.status.slice(1);
    }

    return {
      id: event.id,
      title,
      start: event.start,
      end: event.end,
      allDay: true,
      status: event.status,
      extendedProps: {
        ...event,
        isFuture: event.isFuture,
        expectedDueDate: event.expectedDueDate,
        expectedNotificationDate: event.expectedNotificationDate,
        type: 'maintenance',
      },
      type: 'maintenance',
    };
  };

  if (calendarType === 'month') {
    return maintenancesMonth.map(mapEvent);
  }
  return maintenancesWeek.map(mapEvent);
};
