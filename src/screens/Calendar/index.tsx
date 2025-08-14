import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useKeyPressEvent } from 'react-use';
import FullCalendar from '@fullcalendar/react';

// LIBS
import { Form, Formik } from 'formik';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { FormikSelect } from '@components/Form/FormikSelect';
import { ListTag } from '@components/ListTag';
import { EventTag } from '@components/EventTag';
import { Calendar } from '@components/Calendar';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import { ModalCreateOccasionalMaintenance } from '@components/MaintenanceModals/ModalCreateOccasionalMaintenance';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';
import IconFilter from '@assets/icons/IconFilter';

// GLOBAL TYPES
import type { TModalNames } from '@customTypes/TModalNames';
import type { IMaintenance } from '@customTypes/IMaintenance';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';

// LOCAL SERVICES / UTILS
import { requestCalendarData } from './functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { ICalendarView, IModalAdditionalInformations } from './types';

export type CalendarEventData = ICalendarView & Partial<IMaintenance> & { isFuture?: boolean };

const statusLabels: Record<string, string> = {
  expired: 'Vencidas/Expiradas',
  pending: 'Pendentes',
  inProgress: 'Em execução',
  completed: 'Concluídas',
};

const renderEventContent = (arg: EventContentArg) => {
  const { event, view } = arg;
  const { status } = event.extendedProps;

  const isWeekView = view.type === 'dayGridWeek';
  const statusClass = `status-${(status || event.title || '').toLowerCase().replace(/\s/g, '-')}`;

  if (!isWeekView) {
    const label = statusLabels[status] || event.title;
    return (
      <Style.CustomEvent className={statusClass}>
        <span>{label}</span>
      </Style.CustomEvent>
    );
  }

  return (
    <Style.CustomEvent
      className={statusClass}
      style={{
        flexDirection: 'column',
        padding: '8px',
        background: '#ffffff',
        maxWidth: '177px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Style.EventInfoRow>
          <p>{event?.extendedProps?.Building?.name}</p>
          <EventTag
            label={event?.extendedProps?.serviceOrderNumber}
            color={theme.color.gray4}
            bgColor="white"
            fontWeight="bold"
          />
        </Style.EventInfoRow>

        <Style.EventInfoRow>
          <p>{event?.extendedProps?.Maintenance?.element}</p>
        </Style.EventInfoRow>
      </div>
    </Style.CustomEvent>
  );
};

export const MaintenancesCalendar = () => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });
  const calendarRef = useRef<FullCalendar | null>(null);

  const [date, setDate] = useState(new Date());
  const [modalCreateOccasionalMaintenance, setModalCreateOccasionalMaintenance] = useState(false);
  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [onQuery, setOnQuery] = useState(false);
  const [yearChangeloading, setYearChangeLoading] = useState(false);
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
  const [maintenanceHistoryId, setMaintenanceHistoryId] = useState('');
  const [calendarType, setCalendarType] = useState<'dayGridMonth' | 'dayGridWeek'>('dayGridMonth');
  const [buildingIds, setBuildingIds] = useState<string[]>([]);

  const calendarTypeMap: Record<'dayGridMonth' | 'dayGridWeek', 'month' | 'week'> = {
    dayGridMonth: 'month',
    dayGridWeek: 'week',
  };

  const calendarYear = new Date(date).getFullYear();
  const calendarMonth = new Date(date).getMonth();
  const currentYear = new Date().getFullYear();
  const YearOffset = 5;
  const YearLimitForRequest = currentYear + YearOffset;
  const disableCalendarNextButton = YearLimitForRequest === calendarYear && calendarMonth === 11;

  const events = useMemo(
    () =>
      (maintenancesDisplay as CalendarEventData[]).map((ev) => ({
        id: ev.id ?? '',
        building: ev.Building?.name ?? '',
        title: ev.Maintenance?.element ?? (typeof ev.title === 'string' ? ev.title : 'Manutenção'),
        start: ev.start instanceof Date ? ev.start.toISOString() : ev.start,
        end: ev.end instanceof Date ? ev.end.toISOString() : ev.end,
        status: ev.MaintenancesStatus?.name ?? ev.status ?? '',
        expectedDueDate: ev.expectedDueDate,
        expectedNotificationDate: ev.expectedNotificationDate,
        isFuture: ev.isFuture,
        extendedProps: ev,
        allDay: true,
      })),
    [maintenancesDisplay],
  );

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

  const handleRefresh = () => setRefresh((prev) => !prev);
  const handleQuery = (state: boolean) => setOnQuery(state);
  const handleMaintenanceHistoryIdChange = (id: string) => setMaintenanceHistoryId(id);

  const handleGetCalendarData = useCallback(
    async (startDate?: Date, endDate?: Date) => {
      await requestCalendarData({
        buildingIds,
        yearToRequest: calendarYear,
        monthToRequest: calendarMonth + 1,
        calendarType: calendarTypeMap[calendarType],
        setLoading,
        setMaintenancesWeekView,
        setMaintenancesMonthView,
        setMaintenancesDisplay,
        setYearChangeLoading,
        startDate,
        endDate,
      });
    },
    [
      buildingIds,
      calendarYear,
      calendarMonth,
      calendarType,
      setLoading,
      setMaintenancesWeekView,
      setMaintenancesMonthView,
      setMaintenancesDisplay,
      setYearChangeLoading,
    ],
  );

  const handleClearFilter = () => {
    setBuildingIds([]);
    handleGetCalendarData();
  };

  const handleEventClick = (info: EventClickArg) => {
    const event = info.event.extendedProps;

    if (yearChangeloading) return;

    if (calendarType === 'dayGridWeek') {
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
    } else if (info.event.start) {
      setDate(info.event.start);
      setMaintenancesDisplay([...maintenancesWeekView]);
      setCalendarType('dayGridWeek');
      calendarRef.current?.getApi().changeView('dayGridWeek', info.event.start);
    }
  };

  const handleDatesSet = (arg: {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    view: { type: string };
  }) => {
    const { start, end, view } = arg;
    setDate(start);

    if (view.type === 'dayGridMonth') {
      setMaintenancesDisplay([...maintenancesMonthView]);
      setCalendarType('dayGridMonth');
    } else {
      setMaintenancesDisplay([...maintenancesWeekView]);
      setCalendarType('dayGridWeek');
    }

    handleGetCalendarData(start, end);
  };

  useKeyPressEvent('w', () => {
    if (
      !modalMaintenanceDetails &&
      !modalMaintenanceReportSend &&
      !modalCreateOccasionalMaintenance &&
      !yearChangeloading
    ) {
      setCalendarType('dayGridWeek');
      calendarRef.current?.getApi().changeView('dayGridWeek');
    }
  });

  useKeyPressEvent('m', () => {
    if (
      !modalMaintenanceDetails &&
      !modalMaintenanceReportSend &&
      !modalCreateOccasionalMaintenance &&
      !yearChangeloading
    ) {
      setCalendarType('dayGridMonth');
      calendarRef.current?.getApi().changeView('dayGridMonth');
    }
  });

  useEffect(() => {
    handleGetCalendarData();
  }, [handleGetCalendarData]);

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
            <Formik initialValues={{}} onSubmit={async () => handleGetCalendarData()}>
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
                          if (e.target.value === 'all') setBuildingIds([]);
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
                        onClick={handleClearFilter}
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

        <Calendar
          ref={calendarRef}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          onDatesSet={handleDatesSet}
          initialDate={date}
          initialView={calendarType}
          height={768}
          disableCalendarNextButton={disableCalendarNextButton}
          yearChangeloading={yearChangeloading}
        />
      </Style.Container>
    </>
  );
};
