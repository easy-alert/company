/* eslint-disable @typescript-eslint/no-explicit-any */

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { EventTag } from '@components/EventTag';
import { InProgressTag } from '@components/InProgressTag';

// GLOBAL UTILS
import { catchHandler } from '@utils/functions';

// GLOBAL STYLES
import { theme } from '@styles/theme';

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
}: IRequestCalendarData & { monthToRequest: number }) => {
  setYearChangeLoading(true);

  const params = {
    buildingIds: buildingIds.length > 0 ? buildingIds.join(',') : '',
    year: yearToRequest,
    month: monthToRequest,
  };

  const query = `calendars/list`;

  await Api.get(query, { params })
    .then((res: IRequestCalendarDataResData) => {
      const maintenancesMonthMap: ICalendarView[] = [];

      for (let i = 0; i < res.data.Dates.Months.length; i += 1) {
        const date = new Date(res.data.Dates.Months[i].date);

        if (res.data.Dates.Months[i].expired > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].expired} vencida${
              res.data.Dates.Months[i].expired > 1 ? 's' : ''
            }`,
            start: date,
            end: date,
            status: 'expired',
          });
        }

        if (res.data.Dates.Months[i].pending > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].pending} a fazer`,
            start: date,
            end: date,
            status: 'pending',
          });
        }

        if (res.data.Dates.Months[i].completed > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].completed} concluída${
              res.data.Dates.Months[i].completed > 1 ? 's' : ''
            }`,
            start: date,
            end: date,
            status: 'completed',
          });
        }
      }

      setMaintenancesMonthView([...maintenancesMonthMap]);

      const orderArray = res.data.Dates.Weeks.sort((a, b) =>
        b.MaintenancesStatus.singularLabel.localeCompare(a.MaintenancesStatus.singularLabel),
      );

      const maintenancesWeekMap: ICalendarView[] = orderArray.map((e) => ({
        id: e.id,
        title: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <p
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'wrap',
                  wordBreak: 'break-word',
                }}
              >
                {e.Building.name}
              </p>

              <EventTag
                label={`#${e.serviceOrderNumber}`}
                color={theme.color.gray4}
                bgColor="transparent"
                fontWeight="bold"
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'wrap',
                wordBreak: 'break-word',
              }}
            >
              {e.MaintenancesStatus.name === 'overdue' && <EventTag status="completed" />}
              <EventTag status={e.MaintenancesStatus.name} />
              {e.Maintenance.frequency < 1 ? (
                <EventTag status="occasional" />
              ) : (
                <EventTag status="common" />
              )}
              {(e.MaintenancesStatus.name === 'expired' ||
                e.MaintenancesStatus.name === 'pending') &&
                e.inProgress &&
                !e.isFuture && <InProgressTag />}
            </div>
            <div
              style={{
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'wrap',
                wordBreak: 'break-word',
              }}
            >
              {e.Maintenance.element}
            </div>
            {e.Maintenance.frequency >= 1 && (
              <div style={{ fontSize: '10px' }}>
                A cada {e.Maintenance.frequency}{' '}
                {e.Maintenance.frequency > 1
                  ? e.Maintenance.FrequencyTimeInterval.pluralLabel
                  : e.Maintenance.FrequencyTimeInterval.singularLabel}
              </div>
            )}
          </div>
        ),
        start: new Date(e.notificationDate),
        end: new Date(e.notificationDate),
        status: e.MaintenancesStatus.name,
        isFuture: e.isFuture,
        expectedDueDate: e.expectedDueDate,
        expectedNotificationDate: e.expectedNotificationDate,
      }));

      setMaintenancesWeekView([...maintenancesWeekMap]);

      if (calendarType === 'week') setMaintenancesDisplay([...maintenancesWeekMap]);
      if (calendarType === 'month') setMaintenancesDisplay([...maintenancesMonthMap]);
    })
    .catch(catchHandler)
    .finally(() => {
      setYearChangeLoading(false);
      setLoading(false);
    });
};
