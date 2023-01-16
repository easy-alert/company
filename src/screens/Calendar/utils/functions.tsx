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
      const maintenancesWeekMap: ICalendarView[] = res.data.Dates.map((e) => ({
        id: e.Maintenance.id,
        buildingId: e.Building.id,
        title: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingTop: '4px',
              paddingBottom: '4px',
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

      const maintenancesMonthMap: ICalendarView[] = res.data.Dates.map((e) => ({
        id: e.Maintenance.id,
        buildingId: e.Building.id,
        title: 'Contagem',
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
      setMaintenancesMonthView([...maintenancesMonthMap]);
      setMaintenancesDisplay([...maintenancesMonthMap]);

      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      catchHandler(err);
    });
};
