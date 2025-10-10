// SERVICES
import { getCalendarTicket } from '@services/apis/getCalendarTicket';

// GLOBAL UTILS
import { handleTranslate } from '@utils/handleTranslate';

// GLOBAL TYPES
import type {
  ICalendarDay,
  ICalendarEvent,
  ICalendarTicket,
  IResponseGetCalendarTicket,
} from '@customTypes/ICalendarTicket';

// UTILS
import { requestCalendarData } from '../CalendarMaintenance/functions';

// TYPES
import { ICalendarView } from '../CalendarMaintenance/types';

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
          extendedProps: { type: 'ticket' },
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
  let maintenancesData: ICalendarView[] = [];

  await new Promise<void>((resolve) => {
    requestCalendarData({
      buildingIds: buildingIds || [],
      yearToRequest: year,
      monthToRequest: month,
      calendarType,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setLoading: () => {},
      setMaintenancesMonthView: (arr: ICalendarView[]) => {
        if (calendarType === 'month') {
          maintenancesData = arr;
          resolve();
        }
      },
      setMaintenancesWeekView: (arr: ICalendarView[]) => {
        if (calendarType !== 'month') {
          maintenancesData = arr;
          resolve();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setMaintenancesDisplay: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setYearChangeLoading: () => {},
    });
  });

  return maintenancesData.map((event) => ({
    id: event.id,
    title: typeof event.title === 'string' ? event.title : event.element || 'Manutenção',
    start: event.start,
    end: event.end,
    allDay: true,
    status: event.status,
    extendedProps: {
      ...event,
      type: 'maintenance',
    },
  }));
};
