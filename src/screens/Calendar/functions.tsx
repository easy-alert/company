// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { catchHandler } from '@utils/functions';

// TYPES
import type { ICalendarView, IRequestCalendarData, IRequestCalendarDataResData } from './types';

export const requestCalendarData = async ({
  buildingIds,
  yearToRequest,
  monthToRequest,
  calendarType,
  setMaintenancesMonthView,
  setMaintenancesWeekView,
  setMaintenancesDisplay,
  setYearChangeLoading,
  setLoading,
  startDate,
  endDate,
}: IRequestCalendarData & { monthToRequest: number; startDate?: Date; endDate?: Date }) => {
  setYearChangeLoading(true);

  const params: {
    buildingIds: string;
    year: number;
    month: number;
    startDate?: string;
    endDate?: string;
  } = {
    buildingIds: buildingIds.length > 0 ? buildingIds.join(',') : '',
    year: yearToRequest,
    month: monthToRequest,
  };

  if (calendarType === 'week' && startDate && endDate) {
    params.startDate = startDate.toISOString();
    params.endDate = endDate.toISOString();
  }

  const query = `calendars/list`;

  await Api.get<IRequestCalendarDataResData>(query, { params })
    .then((res) => {
      const monthsData = res.data?.Dates?.Months ?? [];
      const weeksData = res.data?.Dates?.Weeks ?? [];
      const eventsData = res.data?.Events ?? [];

      const maintenancesMonthMap: ICalendarView[] = monthsData
        .map((day) => {
          const date = new Date(day.date);
          const titles = [];
          if (day.pending > 0) titles.push(`${day.pending} pendente${day.pending > 1 ? 's' : ''}`);
          if (day.completed > 0)
            titles.push(`${day.completed} concluída${day.completed > 1 ? 's' : ''}`);
          if (day.expired > 0) titles.push(`${day.expired} vencida${day.expired > 1 ? 's' : ''}`);

          return [
            ...(day.pending > 0
              ? [
                  {
                    id: `${day.date}-pending`,
                    title: `${day.pending} pendente${day.pending > 1 ? 's' : ''}`,
                    start: date,
                    end: date,
                    status: 'pending' as const,
                    allDay: true,
                  },
                ]
              : []),
            ...(day.completed > 0
              ? [
                  {
                    id: `${day.date}-completed`,
                    title: `${day.completed} concluída${day.completed > 1 ? 's' : ''}`,
                    start: date,
                    end: date,
                    status: 'completed' as const,
                    allDay: true,
                  },
                ]
              : []),
            ...(day.expired > 0
              ? [
                  {
                    id: `${day.date}-expired`,
                    title: `${day.expired} vencida${day.expired > 1 ? 's' : ''}`,
                    start: date,
                    end: date,
                    status: 'expired' as const,
                    allDay: true,
                  },
                ]
              : []),
          ];
        })
        .flat();

      setMaintenancesMonthView([...maintenancesMonthMap]);

      const orderArray = weeksData.sort((a, b) =>
        (b.MaintenancesStatus?.singularLabel ?? '').localeCompare(
          a.MaintenancesStatus?.singularLabel ?? '',
        ),
      );

      const maintenancesWeekMap: ICalendarView[] = orderArray.map((e) => ({
        id: e.id,
        title: e.Maintenance?.element ?? 'Manutenção',
        start: new Date(e.notificationDate),
        end: new Date(e.notificationDate),
        status: e.MaintenancesStatus?.name,
        isFuture: e.isFuture,
        expectedDueDate: e.expectedDueDate,
        expectedNotificationDate: e.expectedNotificationDate,
        extendedProps: e,
        allDay: true,
      }));
      setMaintenancesWeekView([...maintenancesWeekMap]);

      setMaintenancesDisplay(eventsData);
    })
    .catch(catchHandler)
    .finally(() => {
      setYearChangeLoading(false);
      setLoading(false);
    });
};
