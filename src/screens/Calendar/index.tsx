/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { useCallback, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useKeyPressEvent } from 'react-use';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// STYLES
import * as Style from './styles';

// MODALS
import { ModalSendMaintenanceReport } from './utils/ModalSendMaintenanceReport';

// FUNCTIONS
import { requestCalendarData } from './utils/functions';
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';
import { ICalendarView } from './utils/types';

export const MaintenancesCalendar = () => {
  const [date, setDate] = useState(new Date());

  const [modalSendMaintenanceReportOpen, setModalSendMaintenanceReportOpen] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [yearChangeloading, setYearChangeLoading] = useState<boolean>(false);

  const [maintenancesWeekView, setMaintenancesWeekView] = useState<ICalendarView[]>([]);

  const [maintenancesMonthView, setMaintenancesMonthView] = useState<ICalendarView[]>([]);

  const [maintenancesDisplay, setMaintenancesDisplay] = useState<ICalendarView[]>([]);

  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string>('');

  const [calendarType, setCalendarType] = useState<
    'month' | 'week' | 'work_week' | 'day' | 'agenda'
  >('month');

  const currentYear = date.getFullYear();

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
      ...(event.status === 'expired' && {
        style: {
          background:
            'linear-gradient(90deg, rgba(255,53,8,1) 0%, rgba(255,53,8,1) 6px, rgba(250,250,250,1) 6px, rgba(250,250,250,1) 100%)',
          color: 'black',
        },
      }),

      ...(event.status === 'pending' && {
        style: {
          background:
            'linear-gradient(90deg, rgba(255,178,0,1) 0%, rgba(255,178,0,1) 6px, rgba(250,250,250,1) 6px, rgba(250,250,250,1) 100%)',
          color: 'black',
        },
      }),

      ...((event.status === 'completed' || event.status === 'overdue') && {
        style: {
          background:
            'linear-gradient(90deg, rgba(52,181,58,1) 0%, rgba(52,181,58,1) 6px, rgba(250,250,250,1) 6px, rgba(250,250,250,1) 100%)',
          color: 'black',
        },
      }),
    }),
    [],
  );

  const onSelectEvent = useCallback(
    (event: any) => {
      if (calendarType === 'week') {
        setSelectedMaintenanceId(event.id);
        // setModalSendMaintenanceReportOpen(true);
      } else {
        setDate(event.start);
        setMaintenancesDisplay([...maintenancesWeekView]);
        setCalendarType('week');
      }
    },
    [
      calendarType,
      setCalendarType,
      maintenancesDisplay,
      setMaintenancesDisplay,
      date,
      setDate,
      selectedMaintenanceId,
      setSelectedMaintenanceId,
    ],
  );

  const onView = useCallback(
    (newView: 'month' | 'week' | 'work_week' | 'day' | 'agenda') => {
      if (newView === 'month') {
        setMaintenancesDisplay([...maintenancesMonthView]);
        setCalendarType('month');
      } else {
        setMaintenancesDisplay([...maintenancesWeekView]);
        setCalendarType('week');
      }
    },
    [calendarType, setCalendarType, maintenancesDisplay, setMaintenancesDisplay],
  );

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);

  useKeyPressEvent('w', () => {
    if (!modalSendMaintenanceReportOpen) {
      onView('week');
    }
  });

  useKeyPressEvent('m', () => {
    if (!modalSendMaintenanceReportOpen) {
      onView('month');
    }
  });

  useEffect(() => {
    requestCalendarData({
      setLoading,
      setMaintenancesWeekView,
      setMaintenancesMonthView,
      setMaintenancesDisplay,
      currentYear,
      setYearChangeLoading,
    });
  }, [currentYear]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalSendMaintenanceReportOpen && selectedMaintenanceId && (
        <ModalSendMaintenanceReport
          setModal={setModalSendMaintenanceReportOpen}
          selectedMaintenanceId={selectedMaintenanceId}
        />
      )}
      <Style.Container>
        <Style.Header>
          <h2>Calendário</h2>
          <select>
            <option value="">Todas</option>
          </select>
        </Style.Header>
        <Style.CalendarScroll>
          <Style.CalendarWrapper view={calendarType}>
            {yearChangeloading && <Style.YearLoading />}
            <Calendar
              date={date}
              onNavigate={onNavigate}
              eventPropGetter={eventPropGetter}
              tooltipAccessor={() => ''}
              view={calendarType}
              onView={onView}
              localizer={localizer}
              messages={messages}
              style={{ height: 768 }}
              onSelectEvent={onSelectEvent}
              culture="pt-BR"
              allDayAccessor="id"
              showAllEvents
              events={maintenancesDisplay}
              drilldownView="week"
            />
          </Style.CalendarWrapper>
        </Style.CalendarScroll>
      </Style.Container>
    </>
  );
};
