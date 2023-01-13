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
              title={`
Edificação
Categoria
Periodicidade
            `}
            >
              {/* if pra se for feita em atraso, mostrar o concluída */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <EventTag status="Concluída" />
                <EventTag status="Feita em atraso" />
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
            new Date(e.date).getUTCFullYear(),
            new Date(e.date).getUTCMonth(),
            new Date(e.date).getUTCDate(),
          ),
          end: new Date(
            new Date(e.date).getUTCFullYear(),
            new Date(e.date).getUTCMonth(),
            new Date(e.date).getUTCDate(),
          ),
          status: 'Feita em atraso',
        }),
      );
      setMaintenancesWeekView([...maintenancesWeekMap]);

      const maintenancesMonthMap = res.data.Dates.map(
        (e: { id: string; element: string; date: string }) => ({
          id: 'Prédio 1',
          title: '10 concluídas',
          start: new Date(
            new Date(e.date).getUTCFullYear(),
            new Date(e.date).getUTCMonth(),
            new Date(e.date).getUTCDate(),
          ),
          end: new Date(
            new Date(e.date).getUTCFullYear(),
            new Date(e.date).getUTCMonth(),
            new Date(e.date).getUTCDate(),
          ),
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
