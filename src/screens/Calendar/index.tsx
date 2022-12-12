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

// STYLES
import * as Style from './styles';

// MODALS
import { ModalMaintenanceInfo } from './utils/ModalMaintenanceInfo';

// FUNCTIONS
import { requestCalendarData } from './utils/functions';
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';

export const MaintenancesCalendar = () => {
  const [modalMaintenanceInfoOpen, setModalMaintenanceInfoOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [maintenancesWeekView, setMaintenancesWeekView] = useState<any>([]);

  const [maintenancesMonthView, setMaintenancesMonthView] = useState<any>([]);

  const [maintenancesDisplay, setMaintenancesDisplay] = useState<any>([]);

  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string>('');

  const [calendarType, setCalendarType] = useState<
    'month' | 'week' | 'work_week' | 'day' | 'agenda'
  >('month');

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
          color: 'white',
        },
      }),

      ...(event.status === 'Pendente' && {
        style: {
          backgroundColor: 'yellow',
          color: 'black',
        },
      }),

      ...(event.status === 'Concluída' && {
        style: {
          backgroundColor: 'green',
          color: 'black',
        },
      }),

      ...(event.status === 'Feita em atraso' && {
        style: {
          backgroundColor: 'brown',
          color: 'black',
        },
      }),
    }),
    [],
  );

  const onSelectEvent = useCallback(
    (maintenance: any) => {
      if (calendarType === 'month') {
        setMaintenancesDisplay([...maintenancesWeekView]);
        setCalendarType('week');
      } else {
        setSelectedMaintenanceId(maintenance.id);
        setModalMaintenanceInfoOpen(true);
      }
    },
    [calendarType, setCalendarType, maintenancesDisplay, setMaintenancesDisplay],
  );

  const onView = useCallback(
    (newView: 'month' | 'week' | 'work_week' | 'day' | 'agenda') => {
      if (newView === 'month') {
        setCalendarType('month');
        setMaintenancesDisplay([...maintenancesMonthView]);
      } else {
        setCalendarType('week');
        setMaintenancesDisplay([...maintenancesWeekView]);
      }

      setCalendarType(newView);
    },
    [calendarType, setCalendarType, maintenancesDisplay, setMaintenancesDisplay],
  );

  useEffect(() => {
    requestCalendarData({
      setLoading,
      setMaintenancesWeekView,
      setMaintenancesMonthView,
      setMaintenancesDisplay,
    });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
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
            <Calendar
              eventPropGetter={eventPropGetter}
              tooltipAccessor={() => ''}
              view={calendarType}
              onView={onView}
              localizer={localizer}
              messages={messages}
              style={{ height: 660 }}
              onSelectEvent={onSelectEvent}
              culture="pt-BR"
              allDayAccessor="id"
              showAllEvents
              events={maintenancesDisplay}
            />
          </Style.CalendarWrapper>
        </Style.CalendarScroll>
      </Style.Container>
    </>
  );
};
