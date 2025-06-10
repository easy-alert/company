// REACT
import { useCallback, useContext, useEffect, useState } from 'react';

// LIBS
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useKeyPressEvent } from 'react-use';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt';

// CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import { ModalCreateOccasionalMaintenance } from '@components/MaintenanceModals/ModalCreateOccasionalMaintenance';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';

// GLOBAL TYPES
import type { TModalNames } from '@customTypes/TModalNames';

// FUNCTIONS
import { requestCalendarData } from './functions';

// STYLES
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as Style from './styles';

// TYPES
import type { IBuildingOptions, ICalendarView, IModalAdditionalInformations } from './types';

export const MaintenancesCalendar = () => {
  const { account } = useContext(AuthContext);
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [date, setDate] = useState(new Date());

  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] =
    useState<boolean>(false);
  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState<boolean>(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalEditReport, setModalEditReport] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [onQuery, setOnQuery] = useState<boolean>(false);

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

  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState<string>('');

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

  const [buildingId, setBuildingId] = useState<string>('none');

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

  const handleModals = (modal: TModalNames, modalState: boolean) => {
    switch (modal) {
      case 'modalMaintenanceReportSend':
        setModalMaintenanceReportSend(modalState);
        break;
      case 'modalMaintenanceDetails':
        setModalMaintenanceDetails(modalState);
        break;
      case 'modalCreateOccasionalMaintenance':
        setModalCreateOccasionalMaintenance(modalState);
        break;

      default:
        break;
    }
  };

  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleQuery = (queryState: boolean) => {
    setOnQuery(queryState);
  };

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);

  const handleModalEditReport = (modalState: boolean) => {
    setModalEditReport(modalState);
  };

  const handleMaintenanceHistoryIdChange = (id: string) => {
    setMaintenanceHistoryId(id);
  };

  const handleGetCalendarData = async () => {
    await requestCalendarData({
      buildingId,
      yearToRequest,
      calendarType,
      setLoading,
      setMaintenancesWeekView,
      setMaintenancesMonthView,
      setMaintenancesDisplay,
      setYearChangeLoading,
      setBuildingOptions,
    });
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
      if (yearChangeloading) return;

      if (calendarType === 'week') {
        handleMaintenanceHistoryIdChange(event.id);

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
          handleModals('modalMaintenanceDetails', true);
        } else if (!event.isFuture && event.id) {
          handleModals('modalMaintenanceReportSend', true);
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
      yearChangeloading,
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

  useKeyPressEvent('w', () => {
    if (
      !modalMaintenanceDetails &&
      !modalMaintenanceReportSend &&
      !modalCreateOccasionalMaintenance &&
      !yearChangeloading
    ) {
      onView('week');
    }
  });

  useKeyPressEvent('m', () => {
    if (
      !modalMaintenanceDetails &&
      !modalMaintenanceReportSend &&
      !modalCreateOccasionalMaintenance &&
      !yearChangeloading
    ) {
      onView('month');
    }
  });

  useEffect(() => {
    handleGetCalendarData();
  }, [buildingId, yearToRequest]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalCreateOccasionalMaintenance && (
        <ModalCreateOccasionalMaintenance
          buildingsForSelect={buildingsForSelect}
          handleModalCreateOccasionalMaintenance={setModalCreateOccasionalMaintenance}
          handleMaintenanceHistoryIdChange={handleMaintenanceHistoryIdChange}
          handleModalMaintenanceDetails={setModalMaintenanceDetails}
          handleModalSendMaintenanceReport={setModalMaintenanceReportSend}
          handleGetBackgroundData={handleGetCalendarData}
        />
      )}

      {modalMaintenanceReportSend && (
        <ModalMaintenanceReportSend
          maintenanceHistoryId={maintenanceHistoryId}
          refresh={refresh}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      {modalMaintenanceDetails && (
        <ModalMaintenanceDetails
          modalAdditionalInformations={{
            ...modalAdditionalInformations,
            id: maintenanceHistoryId || modalAdditionalInformations.id,
          }}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
          handleQuery={handleQuery}
        />
      )}

      {/* {modalEditReport && (
        <ModalEditMaintenanceReport
          maintenanceHistoryId={maintenanceHistoryId || modalAdditionalInformations.id}
          handleModalEditReport={handleModalEditReport}
          onThenActionRequest={async () =>
            requestCalendarData({
              buildingId,
              calendarType,
              yearToRequest,
              setLoading,
              setMaintenancesWeekView,
              setMaintenancesMonthView,
              setMaintenancesDisplay,
              setYearChangeLoading,
              setBuildingOptions,
            })
          }
        />
      )} */}

      <Style.Container>
        <Style.Header arrowColor="primary">
          <h2>Calendário</h2>

          <select
            disabled={yearChangeloading}
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
          >
            <option value="none" hidden>
              Selecione
            </option>

            <option value="">Todas</option>

            {buildingsForSelect.map((building) => (
              <option value={building.id} key={building.id}>
                {building.name}
              </option>
            ))}
          </select>

          <IconButton
            label="Manutenção avulsa"
            icon={<IconPlus strokeColor="primary" />}
            permToCheck="maintenances:createOccasional"
            onClick={() => handleModals('modalCreateOccasionalMaintenance', true)}
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
