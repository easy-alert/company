/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { ICalendarView, IRequestCalendarData, IRequestCalendarDataResData } from './types';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { EventTag } from './EventTag';

export const requestCalendarData = async ({
  setMaintenancesWeekView,
  setMaintenancesMonthView,
  setMaintenancesDisplay,
  setLoading,
}: IRequestCalendarData) => {
  await Api.get('calendars/list')
    .then((res: IRequestCalendarDataResData) => {
      const orderArray = res.data.Dates.Weeks.sort((a, b) =>
        b.MaintenancesStatus.singularLabel.localeCompare(a.MaintenancesStatus.singularLabel),
      );

      const maintenancesWeekMap: ICalendarView[] = orderArray.map((e) => ({
        id: e.Maintenance.id,
        title: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingBottom: '4px',
              paddingTop: '4px',
            }}
            // desalinhado de propósito, para ficar alinhado no tooltip
            title={`
${e.Building.name}
${e.Maintenance.element}
A cada ${e.Maintenance.frequency}${' '}${
              e.Maintenance.frequency > 1
                ? e.Maintenance.FrequencyTimeInterval.pluralLabel
                : e.Maintenance.FrequencyTimeInterval.singularLabel
            }

            `}
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
        start: new Date(
          new Date(e.notificationDate).getUTCFullYear(),
          new Date(e.notificationDate).getUTCMonth(),
          new Date(e.notificationDate).getUTCDate(),
        ),
        end: new Date(
          new Date(e.notificationDate).getUTCFullYear(),
          new Date(e.notificationDate).getUTCMonth(),
          new Date(e.notificationDate).getUTCDate(),
        ),
        status: e.MaintenancesStatus.name,
      }));
      setMaintenancesWeekView([...maintenancesWeekMap]);

      const maintenancesMonthMap: ICalendarView[] = [];

      for (let i = 0; i < res.data.Dates.Months.length; i += 1) {
        if (res.data.Dates.Months[i].expired > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].expired} ${
              res.data.Dates.Months[i].expired > 1 ? 'vencidas' : 'vencida'
            }`,
            start: new Date(
              new Date(res.data.Dates.Months[i].date).getUTCFullYear(),
              new Date(res.data.Dates.Months[i].date).getUTCMonth(),
              new Date(res.data.Dates.Months[i].date).getUTCDate(),
            ),
            end: new Date(
              new Date(res.data.Dates.Months[i].date).getUTCFullYear(),
              new Date(res.data.Dates.Months[i].date).getUTCMonth(),
              new Date(res.data.Dates.Months[i].date).getUTCDate(),
            ),
            status: 'expired',
          });
        }
        if (res.data.Dates.Months[i].pending > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].pending} a fazer`,
            start: new Date(
              new Date(res.data.Dates.Months[i].date).getUTCFullYear(),
              new Date(res.data.Dates.Months[i].date).getUTCMonth(),
              new Date(res.data.Dates.Months[i].date).getUTCDate(),
            ),
            end: new Date(
              new Date(res.data.Dates.Months[i].date).getUTCFullYear(),
              new Date(res.data.Dates.Months[i].date).getUTCMonth(),
              new Date(res.data.Dates.Months[i].date).getUTCDate(),
            ),
            status: 'pending',
          });
        }

        if (res.data.Dates.Months[i].completed > 0) {
          maintenancesMonthMap.push({
            id: String(res.data.Dates.Months[i].id),
            title: `${res.data.Dates.Months[i].completed} ${
              res.data.Dates.Months[i].completed > 1 ? 'concluídas' : 'concluída'
            }`,
            start: new Date(
              new Date(res.data.Dates.Months[i].date).getUTCFullYear(),
              new Date(res.data.Dates.Months[i].date).getUTCMonth(),
              new Date(res.data.Dates.Months[i].date).getUTCDate(),
            ),
            end: new Date(
              new Date(res.data.Dates.Months[i].date).getUTCFullYear(),
              new Date(res.data.Dates.Months[i].date).getUTCMonth(),
              new Date(res.data.Dates.Months[i].date).getUTCDate(),
            ),
            status: 'completed',
          });
        }
      }

      setMaintenancesMonthView([...maintenancesMonthMap]);
      setMaintenancesDisplay([...maintenancesMonthMap]);

      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      catchHandler(err);
    });
};
