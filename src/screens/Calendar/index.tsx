// REACT
import { useCallback, useEffect, useState } from 'react';

// LIBS
import { Form, Formik } from 'formik';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { useKeyPressEvent } from 'react-use';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import { ModalCreateOccasionalMaintenance } from '@components/MaintenanceModals/ModalCreateOccasionalMaintenance';
import { FormikSelect } from '@components/Form/FormikSelect';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';
import IconFilter from '@assets/icons/IconFilter';

// GLOBAL TYPES
import type { TModalNames } from '@customTypes/TModalNames';

// FUNCTIONS
import { requestCalendarData } from './functions';

// STYLES
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as Style from './styles';

// TYPES
import type { ICalendarView, IModalAdditionalInformations } from './types';

export const MaintenancesCalendar = () => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [date, setDate] = useState(new Date());

  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] =
    useState<boolean>(false);
  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState<boolean>(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);

  const [showFilter, setShowFilter] = useState<boolean>(false);
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

  const [buildingIds, setBuildingIds] = useState<string[]>([]);

  const calendarYear = new Date(date).getFullYear();
  const calendarMonth = new Date(date).getMonth();

  const currentYear = new Date().getFullYear();
  const YearOffset = 5;
  const YearLimitForRequest = currentYear + YearOffset;

  const disableCalendarNextButton = YearLimitForRequest === calendarYear && calendarMonth === 11;

  const allowedViews = ['month', 'week', 'work_week', 'day', 'agenda'];

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

  const onNavigate = useCallback(
    (newDate: Date, view: View, action?: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => {
      setDate(newDate);
      if (allowedViews.includes(view)) {
        setCalendarType(view as typeof calendarType);
      }
    },
    [setDate],
  );
  const handleMaintenanceHistoryIdChange = (id: string) => {
    setMaintenanceHistoryId(id);
  };

  const handleGetCalendarData = async () => {
    await requestCalendarData({
      buildingIds,
      yearToRequest: calendarYear,
      monthToRequest: calendarMonth + 1,
      calendarType,
      setLoading,
      setMaintenancesWeekView,
      setMaintenancesMonthView,
      setMaintenancesDisplay,
      setYearChangeLoading,
    });
  };

  const handleClearFilter = () => {
    setBuildingIds([]);
    handleGetCalendarData();
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
    (newView: View) => {
      if (newView === 'month') {
        setMaintenancesDisplay([...maintenancesMonthView]);
        setCalendarType('month');
      } else if (
        newView === 'week' ||
        newView === 'work_week' ||
        newView === 'day' ||
        newView === 'agenda'
      ) {
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
  }, [buildingIds, calendarYear, calendarMonth]);

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

      <Style.Container>
        <Style.Header arrowColor="primary">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Calendário manutenções</h2>

            <IconButton
              label="Filtros"
              icon={<IconFilter strokeColor="primary" />}
              onClick={() => setShowFilter(!showFilter)}
            />
          </div>

          <IconButton
            label="Manutenção avulsa"
            icon={<IconPlus strokeColor="primary" />}
            permToCheck="maintenances:createOccasional"
            onClick={() => handleModals('modalCreateOccasionalMaintenance', true)}
          />
        </Style.Header>

        {showFilter && (
          <Style.FiltersContainer>
            <Formik
              initialValues={{ buildings: [] }}
              onSubmit={async () => handleGetCalendarData()}
            >
              {() => (
                <Form>
                  <Style.FilterWrapper>
                    <div>
                      <FormikSelect
                        id="building-select"
                        label="Edificação"
                        selectPlaceholderValue={' '}
                        value=""
                        disabled={yearChangeloading}
                        onChange={(e) => {
                          setBuildingIds((prev) => [...prev, e.target.value]);

                          if (e.target.value === 'all') {
                            setBuildingIds([]);
                          }
                        }}
                      >
                        <option value="" disabled hidden>
                          Selecione
                        </option>

                        <option value="all" disabled={buildingIds.length === 0}>
                          Todas
                        </option>

                        {buildingsForSelect?.map((building) => (
                          <option
                            value={building.id}
                            key={building.id}
                            disabled={buildingIds.some((b) => b === building.id)}
                          >
                            {building.name}
                          </option>
                        ))}
                      </FormikSelect>
                    </div>

                    <Style.FilterButtonWrapper>
                      <Button
                        type="button"
                        label="Limpar"
                        borderless
                        textColor="primary"
                        disable={loading}
                        onClick={() => handleClearFilter()}
                      />

                      <Button type="submit" label="Filtrar" disable={loading} bgColor="primary" />
                    </Style.FilterButtonWrapper>
                  </Style.FilterWrapper>

                  <Style.FilterWrapperFooter>
                    <Style.FilterTags>
                      {buildingIds.length === 0 ? (
                        <ListTag
                          label="Todas as edificações"
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                        />
                      ) : (
                        buildingIds.map((building) => (
                          <ListTag
                            key={building}
                            label={buildingsForSelect.find((b) => b.id === building)?.name || ''}
                            color="white"
                            backgroundColor="primaryM"
                            fontWeight={500}
                            padding="4px 12px"
                            onClick={() =>
                              setBuildingIds((prev) => prev.filter((b) => b !== building))
                            }
                          />
                        ))
                      )}
                    </Style.FilterTags>
                  </Style.FilterWrapperFooter>
                </Form>
              )}
            </Formik>
          </Style.FiltersContainer>
        )}

        <Style.CalendarScroll>
          <Style.CalendarWrapper
            view={calendarType}
            disableCalendarNextButton={disableCalendarNextButton}
            yearChangeloading={yearChangeloading}
          >
            {yearChangeloading && <DotSpinLoading />}

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
              views={['month', 'week', 'work_week', 'day', 'agenda']}
            />
          </Style.CalendarWrapper>
        </Style.CalendarScroll>
      </Style.Container>
    </>
  );
};
