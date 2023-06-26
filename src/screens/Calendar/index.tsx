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
import { icon } from '../../assets/icons';

// STYLES
import * as Style from './styles';

// MODALS
import { ModalSendMaintenanceReport } from './utils/ModalSendMaintenanceReport';
import { ModalMaintenanceDetails } from './utils/ModalMaintenanceDetails';

// FUNCTIONS
import { requestCalendarData } from './functions';
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';
import { IBuildingOptions, ICalendarView, IModalAdditionalInformations } from './types';
import { IconButton } from '../../components/Buttons/IconButton';
import { ModalCreateOccasionalMaintenance } from './utils/ModalCreateOccasionalMaintenance';

export const MaintenancesCalendar = () => {
  const [date, setDate] = useState(new Date());

  const [modalSendMaintenanceReportOpen, setModalSendMaintenanceReportOpen] =
    useState<boolean>(false);

  const [modalMaintenanceDetailsOpen, setModalMaintenanceDetailsOpen] = useState<boolean>(false);
  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [yearChangeloading, setYearChangeLoading] = useState<boolean>(false);

  const [maintenancesWeekView, setMaintenancesWeekView] = useState<ICalendarView[]>([]);

  const [maintenancesMonthView, setMaintenancesMonthView] = useState<ICalendarView[]>([]);

  const [maintenancesDisplay, setMaintenancesDisplay] = useState<ICalendarView[]>([]);

  const [modalAdditionalInformations, setModalAdditionalInformations] =
    useState<IModalAdditionalInformations>({
      id: '',
      expectedNotificationDate: '',
      expectedDueDate: '',
      isFuture: false,
    });

  const [calendarType, setCalendarType] = useState<
    'month' | 'week' | 'work_week' | 'day' | 'agenda'
  >('month');

  const calendarYear = new Date(date).getFullYear();

  const currentYear = new Date().getFullYear();

  const yearToRequest = calendarYear > currentYear ? currentYear : calendarYear;

  const YearOffset = 5;

  const YearLimitForRequest = new Date().getFullYear() + YearOffset;

  const disableCalendarNextButton =
    YearLimitForRequest === new Date(date).getFullYear() && new Date(date).getMonth() === 11;

  const [buildingId, setBuildingId] = useState<string>('');

  const [buildingOptions, setBuildingOptions] = useState<IBuildingOptions[]>([]);

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
        setModalAdditionalInformations({
          id: event.id,
          expectedNotificationDate: event.expectedNotificationDate,
          isFuture: event.isFuture,
          expectedDueDate: event.expectedDueDate,
        });

        if (
          (event.status === 'completed' || event.status === 'overdue' || event.isFuture) &&
          event.id
        ) {
          setModalMaintenanceDetailsOpen(true);
        } else if (!event.isFuture && event.id) {
          setModalSendMaintenanceReportOpen(true);
        }
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
      modalAdditionalInformations,
      setModalAdditionalInformations,
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
    if (
      !modalSendMaintenanceReportOpen &&
      !modalCreateOccasionalMaintenance &&
      !yearChangeloading
    ) {
      onView('week');
    }
  });

  useKeyPressEvent('m', () => {
    if (
      !modalSendMaintenanceReportOpen &&
      !modalCreateOccasionalMaintenance &&
      !yearChangeloading
    ) {
      onView('month');
    }
  });

  useEffect(() => {
    requestCalendarData({
      setLoading,
      setMaintenancesWeekView,
      setMaintenancesMonthView,
      setMaintenancesDisplay,
      yearToRequest,
      setYearChangeLoading,
      setBuildingOptions,
      buildingId,
      calendarType,
    });
  }, [buildingId, yearToRequest]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalSendMaintenanceReportOpen && modalAdditionalInformations.id && (
        <ModalSendMaintenanceReport
          setModal={setModalSendMaintenanceReportOpen}
          modalAdditionalInformations={modalAdditionalInformations}
          setLoading={setLoading}
          setMaintenancesWeekView={setMaintenancesWeekView}
          setMaintenancesMonthView={setMaintenancesMonthView}
          setMaintenancesDisplay={setMaintenancesDisplay}
          yearToRequest={yearToRequest}
          setYearChangeLoading={setYearChangeLoading}
          setBuildingOptions={setBuildingOptions}
          buildingId={buildingId}
          calendarType={calendarType}
        />
      )}
      {modalMaintenanceDetailsOpen && modalAdditionalInformations.id && (
        <ModalMaintenanceDetails
          setModal={setModalMaintenanceDetailsOpen}
          modalAdditionalInformations={modalAdditionalInformations}
        />
      )}

      {modalCreateOccasionalMaintenance && (
        <ModalCreateOccasionalMaintenance
          setModal={setModalCreateOccasionalMaintenance}
          getCalendarData={async () =>
            requestCalendarData({
              setLoading,
              setMaintenancesWeekView,
              setMaintenancesMonthView,
              setMaintenancesDisplay,
              yearToRequest,
              setYearChangeLoading,
              setBuildingOptions,
              buildingId,
              calendarType,
            })
          }
        />
      )}
      <Style.Container>
        <Style.Header>
          <h2>Calendário</h2>
          <select
            disabled={yearChangeloading}
            value={buildingId}
            onChange={(e) => {
              setBuildingId(e.target.value);
            }}
          >
            <option value="">Todas</option>
            {buildingOptions.map((building) => (
              <option value={building.id} key={building.id}>
                {building.name}
              </option>
            ))}
          </select>

          <IconButton
            icon={icon.plus}
            label="Manutenção avulsa"
            onClick={() => setModalCreateOccasionalMaintenance(true)}
          />
        </Style.Header>
        <Style.CalendarScroll>
          <Style.CalendarWrapper
            view={calendarType}
            disableCalendarNextButton={disableCalendarNextButton}
            yearChangeloading={yearChangeloading}
          >
            {yearChangeloading && <Style.YearLoading />}
            <Calendar
              date={date}
              onNavigate={onNavigate}
              eventPropGetter={eventPropGetter}
              view={calendarType}
              onView={onView}
              localizer={localizer}
              messages={messages}
              style={{ height: 768 }}
              onSelectEvent={onSelectEvent}
              events={maintenancesDisplay}
              tooltipAccessor={() => ''}
              culture="pt-BR"
              allDayAccessor="id"
              drilldownView="week"
              showAllEvents
            />
          </Style.CalendarWrapper>
        </Style.CalendarScroll>
      </Style.Container>
    </>
  );
};
