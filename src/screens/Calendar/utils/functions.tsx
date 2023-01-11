import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { EventTag } from './EventTag';
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingTop: '4px',
                paddingBottom: '4px',
              }}
              title={`
PREDIO
mesakeoaske
${e.id}
            `}
            >
              <EventTag status="Pendente" />
              <div className="ellipsis" style={{ fontSize: '14px', lineHeight: '16px' }}>
                Edificação
              </div>
              <div className="ellipsis" style={{ fontSize: '12px', lineHeight: '14px' }}>
                Categoria
              </div>
              <div className="ellipsis" style={{ fontSize: '10px', lineHeight: '12px' }}>
                Periodicidade
              </div>
            </div>
          ),
          start: new Date(e.date),
          end: new Date(e.date),
          status: 'Pendente',
        }),
      );
      setMaintenancesWeekView([...maintenancesWeekMap]);

      const maintenancesMonthMap = res.data.Dates.map(
        (e: { id: string; element: string; date: string }) => ({
          id: 'Prédio 1',
          title: '8 a fazer',
          start: new Date(e.date),
          end: new Date(e.date),
          status: 'Pendente',
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
