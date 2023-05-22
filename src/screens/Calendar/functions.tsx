/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICalendarView, IRequestCalendarData, IRequestCalendarDataResData } from './types';
import { Api } from '../../services/api';
import { catchHandler } from '../../utils/functions';
import { EventTag } from './utils/EventTag';

export const requestCalendarData = async ({
  setMaintenancesMonthView,
  setMaintenancesWeekView,
  setMaintenancesDisplay,
  setLoading,
  yearToRequest,
  setYearChangeLoading,
  setBuildingOptions,
  buildingId,
  calendarType,
}: IRequestCalendarData) => {
  // setYearChangeLoading(true);

  await Api.get(`calendars/list/${String(yearToRequest)}?buildingId=${buildingId}`)
    .then((res: IRequestCalendarDataResData) => {
      setBuildingOptions(res.data.Filter);

      const maintenancesMonthMap: ICalendarView[] = [];

      for (let i = 0; i < res.data.Dates.Months.length; i += 1) {
        if (res.data.Dates.Months[i].expired > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].expired} ${
              res.data.Dates.Months[i].expired > 1 ? 'vencidas' : 'vencida'
            }`,
            start: new Date(res.data.Dates.Months[i].date),
            end: new Date(res.data.Dates.Months[i].date),
            status: 'expired',
          });
        }
        if (res.data.Dates.Months[i].pending > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].pending} a fazer`,
            start: new Date(res.data.Dates.Months[i].date),
            end: new Date(res.data.Dates.Months[i].date),
            status: 'pending',
          });
        }

        if (res.data.Dates.Months[i].completed > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].completed} ${
              res.data.Dates.Months[i].completed > 1 ? 'concluídas' : 'concluída'
            }`,
            start: new Date(res.data.Dates.Months[i].date),
            end: new Date(res.data.Dates.Months[i].date),
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingTop: '4px',
              paddingBottom: '4px',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {e.MaintenancesStatus.name === 'overdue' && <EventTag status="completed" />}
              <EventTag status={e.MaintenancesStatus.name} />
            </div>

            <div className="ellipsis" style={{ fontSize: '14px', lineHeight: '17px' }}>
              {e.Building.name}
            </div>
            <div className="ellipsis" style={{ fontSize: '12px', lineHeight: '15px' }}>
              {e.Maintenance.element}
            </div>
            <div className="ellipsis" style={{ fontSize: '10px', lineHeight: '13px' }}>
              A cada {e.Maintenance.frequency}{' '}
              {e.Maintenance.frequency > 1
                ? e.Maintenance.FrequencyTimeInterval.pluralLabel
                : e.Maintenance.FrequencyTimeInterval.singularLabel}
            </div>
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

      if (calendarType === 'week') {
        setMaintenancesDisplay([...maintenancesWeekMap]);
      }

      if (calendarType === 'month') {
        setMaintenancesDisplay([...maintenancesMonthMap]);
      }
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setYearChangeLoading(false);
      setLoading(false);
    });
};
