import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { IRequestCalendarData } from './types';

export const requestCalendarData = async ({
  setMaintenancesWeekView,
  setMaintenancesMonthView,
  setMaintenancesDisplay,
  setLoading,
}: IRequestCalendarData) => {
  await Api.get('calendars/list')
    .then((res) => {
      const maintenancesWeekMap = res.data.Dates.map(
        (e: { id: string; element: string; date: string }) => ({
          id: 'Prédio 1',
          title: (
            <div title={`${e.id}${e.id}${e.id}`}>
              <div className="ellipsis" style={{ fontSize: '18px' }}>
                PREDIO
              </div>
              <div className="ellipsis" style={{ fontSize: '14px' }}>
                CATEGORIA
              </div>
              <div className="ellipsis" style={{ fontSize: '12px' }}>
                {e.element}
              </div>
            </div>
          ),
          start: new Date(e.date),
          end: new Date(e.date),
          status: 'Concluída',
        }),
      );
      setMaintenancesWeekView([...maintenancesWeekMap]);

      const maintenancesMonthMap = res.data.Dates.map(
        (e: { id: string; element: string; date: string }) => ({
          id: 'Prédio 1',
          title: '8 a fazer',
          start: new Date(e.date),
          end: new Date(e.date),
          status: 'Concluída',
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
