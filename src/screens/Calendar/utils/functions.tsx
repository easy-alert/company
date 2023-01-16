import { IRequestCalendarData } from './types';
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
    .then((res) => {
      const maintenancesWeekMap = res.data.Dates.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => ({
          id: e.Maintenance.id,
          title: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingTop: '4px',
                paddingBottom: '4px',
              }}
              title={`
Edificação
Categoria
Periodicidade
            `}
            >
              {/* if pra se for feita em atraso, mostrar o concluída */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <EventTag status="completed" />
                <EventTag status="overdue" />
              </div>

              <div className="ellipsis" style={{ fontSize: '14px', lineHeight: '17px' }}>
                Edificação
              </div>
              <div className="ellipsis" style={{ fontSize: '12px', lineHeight: '15px' }}>
                Categoria
              </div>
              <div className="ellipsis" style={{ fontSize: '10px', lineHeight: '13px' }}>
                Periodicidade
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
          status: 'overdue',
        }),
      );
      setMaintenancesWeekView([...maintenancesWeekMap]);

      const maintenancesMonthMap = res.data.Dates.map(
        (e: { id: string; element: string; notificationDate: string }) => ({
          id: 'Prédio 1',
          title: '10 concluídas',
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
          status: 'completed',
        }),
      );
      setMaintenancesMonthView([...maintenancesMonthMap]);
      setMaintenancesDisplay([...maintenancesMonthMap]);

      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      catchHandler(err);
    });
};
