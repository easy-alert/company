/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { useCallback, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// MODALS
import { ModalMaintenanceInfo } from './utils/ModalMaintenanceInfo';

// STYLES
import * as Style from './styles';

export const MaintenancesCalendar = () => {
  const [modalMaintenanceInfoOpen, setModalMaintenanceInfoOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [maintenances, setMaintenances] = useState<any>([]);

  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string>('');

  const locales = {
    'pt-BR': ptBR,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const messages = {
    date: 'Data',
    time: 'Tempo',
    event: 'Evento',
    allDay: 'Dia todo',
    week: 'Semana',
    work_week: 'Semana de trabalho',
    day: 'Dia',
    month: 'Mês',
    previous: 'Anterior',
    next: 'Próximo',
    yesterday: 'Ontem',
    tomorrow: 'Amanhã',
    today: 'Hoje',
    agenda: 'Agenda',
    noEventsInRange: 'Nenhum evento encontrado.',

    showMore: (total: any) => `+${total}`,
  };

  const eventPropGetter = useCallback(
    (event: any) => ({
      ...(event.status === 'Vencida' && {
        style: {
          backgroundColor: 'red',
        },
      }),

      ...(event.status === 'Pendente' && {
        style: {
          backgroundColor: 'yellow',
        },
      }),

      ...(event.status === 'Concluída' && {
        style: {
          backgroundColor: 'green',
        },
      }),

      ...(event.status === 'Feita em atraso' && {
        style: {
          backgroundColor: 'brown',
        },
      }),
    }),
    [],
  );

  const onSelectEvent = useCallback((maintenance: any) => {
    setSelectedMaintenanceId(maintenance.id);
    setModalMaintenanceInfoOpen(true);
  }, []);

  const onNavigate = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line no-console
    console.log('navegou');
  }, []);

  // tentar cancelar a requisição anterior se fizer outra por cima, pra ele pode ficar navegando no calendário
  // ver o loading
  useEffect(() => {
    setMaintenances([
      {
        id: 'Prédio 1',
        title: (
          <div
            title="Prédio 1&#10;Categoria 1&#10;Manutenção 1"
          >
            <div className="ellipsis" style={{ fontSize: '18px' }}>
              Prédio 1
            </div>
            <div className="ellipsis" style={{ fontSize: '14px' }}>
              Categoria 1
            </div>
            <div className="ellipsis" style={{ fontSize: '12px' }}>
              Manutenção 1
            </div>
          </div>
        ),
        start: new Date(),
        end: new Date(),
        status: 'Concluída',
      },
      {
        id: 'Prédio 2',
        title: (
          <div
            title="Prédio 1&#10;Categoria 1&#10;Manutenção 1"
          >
            <div className="ellipsis" style={{ fontSize: '18px' }}>
              Prédio 2
            </div>
            <div className="ellipsis" style={{ fontSize: '14px' }}>
              Categoria 2
            </div>
            <div className="ellipsis" style={{ fontSize: '12px' }}>
              Manutenção 2
            </div>
          </div>
        ),
        start: new Date(),
        end: new Date(),
        status: 'Vencida',
      },
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {modalMaintenanceInfoOpen && selectedMaintenanceId && (
        <ModalMaintenanceInfo
          setModal={setModalMaintenanceInfoOpen}
          selectedMaintenanceId={selectedMaintenanceId}
        />
      )}
      <Style.Container>
        <Style.Header>
          <h2>Calendário</h2>
          <select>
            <option value="">Todas</option>
            <option value="Prédio 1">Prédio 1</option>
          </select>
        </Style.Header>
        <Style.CalendarScroll>
          <Style.CalendarWrapper>
            {loading && <Style.SmallDotSpinLoading />}
            <Calendar
              eventPropGetter={eventPropGetter}
              tooltipAccessor={() => ''}
              localizer={localizer}
              messages={messages}
              events={maintenances}
              style={{ height: 660 }}
              onSelectEvent={onSelectEvent}
              onNavigate={onNavigate}
              culture="pt-BR"
              showAllEvents
              allDayAccessor="id"
            />
          </Style.CalendarWrapper>
        </Style.CalendarScroll>
      </Style.Container>
    </>
  );
};
