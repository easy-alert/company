// #region imports

// REACT
import { useEffect, useState, useRef, useCallback } from 'react';
import Chart from 'react-apexcharts';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// LIBS
import { Form, Formik } from 'formik';

// SERVICES
import { getDashboardFilters } from '@services/apis/getDashboardFilters';
import { getMaintenancesCountAndCost } from '@services/apis/getMaintenancesCountAndCost';
import { getTicketsCountAndCost } from '@services/apis/getTicketsCountAndCost';
import { getTicketsByServiceTypes } from '@services/apis/getTicketsByServiceTypes';
import { getMaintenancesByStatus } from '@services/apis/getMaintenancesByStatus';
import { getMaintenancesTimeline } from '@services/apis/getMaintenancesTimeline';
import { getMaintenancesMostCompletedExpired } from '@services/apis/getMaintenancesMostCompletedExpired';

// GLOBAL COMPONENTS
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';
import { FormikInput } from '@components/Form/FormikInput';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { ITicketStatusNames } from '@customTypes/ITicket';

// COMPONENTS
import { ModalDashboardMaintenanceDetails } from './ModalDashboardMaintenanceDetails';

// STYLES
import * as Style from './styles';
// #endregion

// #region interfaces
interface IMaintenance {
  Category: {
    name: string;
  };
  id: string;
  element: string;
  activity: string;
  frequency: number;
  FrequencyTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  responsible: string;
  source: string;
  period: number;
  PeriodTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  delay: number;
  DelayTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  observation: string;
}

export interface IDashboardFilter {
  startDate: string;
  endDate: string;
  buildings: string[];
  categories: string[];
  responsible: string[];
}

interface IPeriods {
  label: string;
  period: number;
}

interface IFilterOptions {
  buildings: string[];
  categories: string[];
  responsible: string[];
  periods: IPeriods[];
}

type IFilterTypes = 'startDate' | 'endDate' | 'buildings' | 'categories' | 'responsible';

interface ITimeline {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface IRating {
  allCount: number;
  count: number;
  data: IMaintenance;
  id: string;
  rating: number;
}

type IRatingStatus = '' | 'completed' | 'expired';

interface IMostCompletedExpired {
  completed: IRating[];
  expired: IRating[];
}

interface ICountAndCost {
  count: number;
  cost: string;
}

interface IMaintenancesData {
  commonMaintenanceData: ICountAndCost;
  occasionalMaintenanceData: ICountAndCost;
  totalMaintenanceData: ICountAndCost;
}

interface ITicketsData {
  openTickets: ICountAndCost;
  awaitingToFinishTickets: ICountAndCost;
  finishedTickets: ICountAndCost;
  dismissedTickets: ICountAndCost;
  totalTickets: ICountAndCost;
}

interface IPieChart {
  data: number[];
  labels: string[];
  colors: string[];
}

interface IDashboardLoadings {
  maintenances: boolean;
  tickets: boolean;
  timeline: boolean;
  score: boolean;
  ticketTypes: boolean;
  mostCompletedExpired: boolean;
}
// #endregion

export interface ITicketFilter {
  startDate?: string;
  endDate?: string;
  edification: string[];
  category: string[];
  responsible: string[];
  seen: string;
}

export const Dashboard = () => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  // #region states
  const [maintenancesData, setMaintenancesData] = useState<IMaintenancesData>({
    commonMaintenanceData: {
      count: 0,
      cost: '',
    },
    occasionalMaintenanceData: {
      count: 0,
      cost: '',
    },
    totalMaintenanceData: {
      count: 0,
      cost: '',
    },
  });

  const [maintenancesTimeline, setMaintenancesTimeline] = useState<ITimeline>({
    categories: [],
    series: [],
  });

  const [maintenanceChart, setMaintenanceChart] = useState<IPieChart>({
    data: [],
    labels: [],
    colors: [],
  });

  const [maintenancesMostCompletedExpired, setMaintenancesMostCompletedExpired] =
    useState<IMostCompletedExpired>({
      completed: [],
      expired: [],
    });

  const [ticketsData, setTicketsData] = useState<ITicketsData>({
    openTickets: {
      count: 0,
      cost: '',
    },
    awaitingToFinishTickets: {
      count: 0,
      cost: '',
    },
    finishedTickets: {
      count: 0,
      cost: '',
    },
    dismissedTickets: {
      count: 0,
      cost: '',
    },
    totalTickets: {
      count: 0,
      cost: '',
    },
  });

  const [ticketsServicesTypeChart, setTicketsServicesTypeChart] = useState<IPieChart>({
    data: [],
    labels: [],
    colors: [],
  });

  const [modalDashboardMaintenanceDetails, setModalDashboardMaintenanceDetails] =
    useState<boolean>(false);

  const [selectedRating, setSelectedRating] = useState<IRating>({
    allCount: 0,
    count: 0,
    data: {
      Category: {
        name: '',
      },
      id: '',
      element: '',
      activity: '',
      frequency: 0,
      FrequencyTimeInterval: {
        pluralLabel: '',
        singularLabel: '',
      },
      responsible: '',
      source: '',
      period: 0,
      PeriodTimeInterval: {
        pluralLabel: '',
        singularLabel: '',
      },
      delay: 0,
      DelayTimeInterval: {
        pluralLabel: '',
        singularLabel: '',
      },
      observation: '',
    },
    id: '',
    rating: 0,
  });

  const [selectedRatingStatus, setSelectedRatingStatus] = useState<IRatingStatus>('');

  const dataFilterInitialValues: IDashboardFilter = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    buildings: [],
    categories: [],
    responsible: [],
  };

  const [dataFilter, setDataFilter] = useState<IDashboardFilter>(dataFilterInitialValues);

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    buildings: [],
    categories: [],
    responsible: [],
    periods: [],
  });

  const [scrollLeft, setScrollLeft] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardLoadings, setDashboardLoadings] = useState<IDashboardLoadings>({
    maintenances: true,
    tickets: true,
    timeline: true,
    score: true,
    ticketTypes: true,
    mostCompletedExpired: true,
  });
  // #endregion

  const totalTicketsCount =
    ticketsData.openTickets.count +
    ticketsData.awaitingToFinishTickets.count +
    ticketsData.finishedTickets.count +
    ticketsData.dismissedTickets.count;

  // #region requests
  const handleGetDashboardFilters = async () => {
    setLoading(true);

    try {
      const responseData = await getDashboardFilters();

      setFilterOptions(responseData);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMaintenancesCountAndCost = async (
    maintenanceType: 'common' | 'occasional' | '',
    resetFilters?: boolean,
  ) => {
    try {
      const responseData = await getMaintenancesCountAndCost(
        dataFilter,
        maintenanceType,
        resetFilters,
      );

      const formattedData = {
        count: responseData.maintenancesCount,
        cost: responseData.maintenancesCost,
      };

      switch (maintenanceType) {
        case 'common':
          setMaintenancesData((prevState) => ({
            ...prevState,
            commonMaintenanceData: formattedData,
          }));
          break;
        case 'occasional':
          setMaintenancesData((prevState) => ({
            ...prevState,
            occasionalMaintenanceData: formattedData,
          }));
          break;
        default:
          setMaintenancesData((prevState) => ({
            ...prevState,
            totalMaintenanceData: formattedData,
          }));
          break;
      }
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const handleGetTicketsCountAndCost = async (
    ticketStatus: ITicketStatusNames | '',
    resetFilters?: boolean,
  ) => {
    try {
      const responseData = await getTicketsCountAndCost(dataFilter, ticketStatus, resetFilters);

      const formattedData = {
        count: responseData.ticketsCount,
        cost: responseData.ticketsCost,
      };

      switch (ticketStatus) {
        case 'open':
          setTicketsData((prevState) => ({
            ...prevState,
            openTickets: formattedData,
          }));
          break;
        case 'awaitingToFinish':
          setTicketsData((prevState) => ({
            ...prevState,
            awaitingToFinishTickets: formattedData,
          }));
          break;
        case 'finished':
          setTicketsData((prevState) => ({
            ...prevState,
            finishedTickets: formattedData,
          }));
          break;
        case 'dismissed':
          setTicketsData((prevState) => ({
            ...prevState,
            dismissedTickets: formattedData,
          }));
          break;
        default:
          return;
      }
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const handleGetTicketsByServiceType = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, ticketTypes: true }));

    try {
      const responseData = await getTicketsByServiceTypes(dataFilter, resetFilters);

      setTicketsServicesTypeChart(responseData);
      setDashboardLoadings((prevState) => ({ ...prevState, ticketTypes: false }));
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
      setDashboardLoadings((prevState) => ({ ...prevState, ticketTypes: false }));
    }
  };

  const handleGetMaintenancesByStatus = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, score: true }));

    try {
      const responseData = await getMaintenancesByStatus(dataFilter, resetFilters);

      setMaintenanceChart(responseData);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, score: false }));
    }
  };

  const handleGetMaintenancesTimeline = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, timeline: true }));

    try {
      const responseData = await getMaintenancesTimeline(dataFilter, resetFilters);

      setMaintenancesTimeline(responseData);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, timeline: false }));
    }
  };

  const handleGetMaintenancesMostCompletedExpired = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, mostCompletedExpired: true }));

    try {
      const responseData = await getMaintenancesMostCompletedExpired(dataFilter, resetFilters);

      setMaintenancesMostCompletedExpired(responseData);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, mostCompletedExpired: false }));
    }
  };
  // #endregion

  // #region dashboard functions
  const handleGetAllMaintenancesCountAndCost = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, maintenances: true }));

    try {
      await handleGetMaintenancesCountAndCost('', resetFilters);
      await handleGetMaintenancesCountAndCost('common', resetFilters);
      await handleGetMaintenancesCountAndCost('occasional', resetFilters);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, maintenances: false }));
    }
  };

  const handleGetAllTicketsCountAndCost = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, tickets: true }));

    try {
      await handleGetTicketsCountAndCost('', resetFilters);
      await handleGetTicketsCountAndCost('open', resetFilters);
      await handleGetTicketsCountAndCost('awaitingToFinish', resetFilters);
      await handleGetTicketsCountAndCost('finished', resetFilters);
      await handleGetTicketsCountAndCost('dismissed', resetFilters);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, tickets: false }));
    }
  };

  const handleGetDashboardData = async (resetFilters?: boolean) => {
    // get count and cost from all maintenance types
    handleGetAllMaintenancesCountAndCost(resetFilters);

    // get count and cost from all ticket status
    handleGetAllTicketsCountAndCost(resetFilters);

    // get maintenance timeline
    handleGetMaintenancesTimeline(resetFilters);

    // get maintenance score
    handleGetMaintenancesByStatus(resetFilters);

    // get ticket types
    handleGetTicketsByServiceType(resetFilters);

    // get most completed and expired maintenances
    handleGetMaintenancesMostCompletedExpired(resetFilters);
  };

  const handleResetFilterButton = async () => {
    setDataFilter({
      ...dataFilterInitialValues,
      startDate: '',
      endDate: '',
    });

    try {
      handleGetDashboardData(true);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const findLargestValueAndIndex = (array: number[]) => {
    if (!array) return { value: 0, index: 0 };
    if (array.length === 0) return { value: 0, index: 0 };

    let largestValue = array[0];
    let largestValueIndex = 0;

    array.reduce((_previousIndex, currentValue, currentIndex) => {
      if (currentValue > largestValue) {
        largestValue = currentValue;
        largestValueIndex = currentIndex;
      }
      return currentIndex;
    }, 0);

    return { value: largestValue, index: largestValueIndex };
  };

  const handleFilterChange = (key: keyof IDashboardFilter, value: string) => {
    setDataFilter((prevState) => {
      const checkArray = Array.isArray(prevState[key]);
      const newFilter = { ...prevState, [key]: value };

      if (checkArray) {
        return {
          ...newFilter,
          [key]: [...(prevState[key] as string[]), value],
        };
      }

      return newFilter;
    });
  };

  const handleRemoveFilter = (filterType: IFilterTypes, index: number) => {
    setDataFilter((prevState) => {
      const newFilter = { ...prevState };

      if (Array.isArray(prevState[filterType])) {
        (newFilter[filterType] as string[]) = (prevState[filterType] as string[]).filter(
          (_, i) => i !== index,
        );
      }

      return newFilter;
    });
  };

  const handleSelectedMaintenance = (rating: IRating, status: IRatingStatus) => {
    setSelectedRating(rating);
    setSelectedRatingStatus(status);
    setModalDashboardMaintenanceDetails(true);
  };
  // #endregion

  // #region charts options
  const timeLineChart = {
    series: maintenancesTimeline.series,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      colors: ['#34B53A', '#FF3508', '#FFB200'],
      grid: {
        show: false,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '16px',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value: any) => parseInt(value, 10).toLocaleString('pt-BR'),
        },
      },

      yaxis: {
        labels: {
          formatter: (value: any) => parseInt(value, 10).toLocaleString('pt-BR'),
        },
      },

      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },

      xaxis: {
        categories: maintenancesTimeline.categories,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      fill: {
        opacity: 1,
      },
    },
  };

  const scoreChart = {
    series: maintenanceChart.data,
    options: {
      labels: maintenanceChart.labels,

      chart: {
        toolbar: {
          show: false,
        },
      },

      tooltip: {
        enabled: true,
      },

      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10,
          },
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                offsetY: 4,
                color: '#000000',
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                formatter(val: any, w: any) {
                  const percent =
                    (val * 100) / w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                  return `${percent.toFixed(1)} %`;
                },
              },
              total: {
                show: true,
                showAlways: false,

                label:
                  maintenanceChart.labels[findLargestValueAndIndex(maintenanceChart.data).index],
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',

                formatter(w: any) {
                  const percent =
                    (w.globals.seriesTotals[findLargestValueAndIndex(maintenanceChart.data).index] *
                      100) /
                    w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);

                  return `${percent.toFixed(1)} %`;
                },
              },
            },
          },
        },
      },

      colors: maintenanceChart.colors,
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '14px',
          fontWeight: 400,
        },
      },
      legend: {
        position: 'bottom' as const,
        offsetY: -10,
      },
    },
  };

  const ticketTypesChart = {
    series: ticketsServicesTypeChart.data,

    options: {
      labels: ticketsServicesTypeChart.labels,

      chart: {
        toolbar: {
          show: false,
        },
      },

      tooltip: {
        enabled: true,
      },

      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10,
          },
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                offsetY: 4,
                color: '#000000',
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                formatter(val: any, w: any) {
                  const percent =
                    (val * 100) / w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                  return `${percent.toFixed(1)} %`;
                },
              },
              total: {
                show: true,
                showAlways: false,

                label:
                  ticketsServicesTypeChart.labels[
                    findLargestValueAndIndex(ticketsServicesTypeChart.data).index
                  ],
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',

                formatter(w: any) {
                  const percent =
                    (w.globals.seriesTotals[
                      findLargestValueAndIndex(ticketsServicesTypeChart.data).index
                    ] *
                      100) /
                    w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);

                  return `${percent.toFixed(1)} %`;
                },
              },
            },
          },
        },
      },

      dataLabels: {
        enabled: false,
        style: {
          fontSize: '14px',
          fontWeight: 400,
        },
      },

      legend: {
        position: 'bottom' as const,
        offsetY: -5,
      },

      colors: ticketsServicesTypeChart.colors,
    },
  };
  // #endregion

  const handleScroll = (event: any) => {
    if (!scrollRef.current?.clientWidth) return;

    const newScrollLeft = event.target.scrollLeft + (scrollRef.current.clientWidth - 261) / 2;
    setScrollLeft(newScrollLeft);
  };

  const refCallback = useCallback(
    (node: any) => {
      scrollRef.current = node;

      if (scrollRef.current) {
        setScrollLeft((scrollRef.current.clientWidth - 261) / 2);
        setDivWidth(scrollRef.current.clientWidth);
      }
    },
    [windowWidth],
  );

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };
  // #endregion

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    handleGetDashboardFilters();
    handleGetDashboardData();
  }, []);

  useEffect(() => {
    if (
      dashboardLoadings.maintenances ||
      dashboardLoadings.tickets ||
      dashboardLoadings.timeline ||
      dashboardLoadings.score ||
      dashboardLoadings.ticketTypes ||
      dashboardLoadings.mostCompletedExpired
    ) {
      setOnQuery(true);
    } else {
      setOnQuery(false);
    }
  }, [dashboardLoadings]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalDashboardMaintenanceDetails && (
        <ModalDashboardMaintenanceDetails
          setModal={setModalDashboardMaintenanceDetails}
          status={selectedRatingStatus}
          rating={selectedRating}
        />
      )}

      <Style.Container>
        <h2>Dashboard</h2>

        <Style.FilterSection>
          <h5>Filtros</h5>

          <Formik
            initialValues={{
              startDate: new Date(new Date().setDate(new Date().getDate() - 7))
                .toISOString()
                .split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              edification: [],
              category: [],
              responsible: [],
              seen: '',
            }}
            onSubmit={async () => handleGetDashboardData()}
          >
            {({ values, setFieldValue, touched, errors }) => (
              <Form>
                <Style.FilterWrapper>
                  <FormikInput
                    label="Data inicial"
                    typeDatePlaceholderValue={values.startDate}
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={(e) => {
                      setFieldValue('startDate', e.target.value);
                      handleFilterChange('startDate', e.target.value);
                    }}
                    error={touched.startDate && errors.startDate ? errors.startDate : null}
                  />

                  <FormikInput
                    label="Data final"
                    typeDatePlaceholderValue={values.endDate}
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    onChange={(e) => {
                      setFieldValue('endDate', e.target.value);
                      handleFilterChange('endDate', e.target.value);
                    }}
                    error={touched.endDate && errors.endDate ? errors.endDate : null}
                  />

                  <Select
                    selectPlaceholderValue={dataFilter.buildings.length > 0 ? ' ' : ''}
                    label="Edificação"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('buildings', e.target.value);

                      if (e.target.value === 'all') {
                        setDataFilter((prevState) => ({ ...prevState, buildings: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={dataFilter.buildings.length === 0}>
                      Todas
                    </option>

                    {buildingsForSelect.map((building) => (
                      <option
                        key={building.id}
                        value={building.name}
                        disabled={dataFilter.buildings.some((e) => e === building.name)}
                      >
                        {building.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={dataFilter.categories.length > 0 ? ' ' : ''}
                    label="Categoria"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('categories', e.target.value);

                      if (e.target.value === 'all') {
                        setDataFilter((prevState) => ({ ...prevState, categories: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={dataFilter.categories.length === 0}>
                      Todas
                    </option>

                    {filterOptions.categories.map((category) => (
                      <option
                        label={category}
                        key={category}
                        disabled={dataFilter.categories.some((e) => e === category)}
                      >
                        {category}
                      </option>
                    ))}
                  </Select>

                  <Select
                    selectPlaceholderValue={dataFilter.responsible.length > 0 ? ' ' : ''}
                    label="Responsável"
                    arrowColor="primary"
                    value=""
                    onChange={(e) => {
                      handleFilterChange('responsible', e.target.value);

                      if (e.target.value === 'all') {
                        setDataFilter((prevState) => ({ ...prevState, responsible: [] }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Selecione
                    </option>

                    <option value="all" disabled={dataFilter.responsible.length === 0}>
                      Todos
                    </option>

                    {filterOptions.responsible.map((responsible) => (
                      <option
                        value={responsible}
                        key={responsible}
                        disabled={dataFilter.responsible.some((e) => e === responsible)}
                      >
                        {responsible}
                      </option>
                    ))}
                  </Select>

                  <Style.ButtonWrapper>
                    <Button
                      label="Limpar filtros"
                      type="button"
                      textColor="primary"
                      disable={onQuery}
                      borderless
                      onClick={() => {
                        setFieldValue('startDate', '');
                        setFieldValue('endDate', '');

                        handleResetFilterButton();
                      }}
                    />

                    <Button label="Filtrar" type="submit" loading={onQuery} />
                  </Style.ButtonWrapper>

                  <Style.Tags>
                    {dataFilter.buildings.length === 0 && (
                      <ListTag
                        padding="4px 12px"
                        fontWeight={500}
                        label="Todas as edificações"
                        backgroundColor="primary"
                      />
                    )}

                    {dataFilter.buildings.map((e, i) => (
                      <ListTag
                        padding="4px 12px"
                        backgroundColor="primary"
                        fontWeight={500}
                        label={e}
                        key={e}
                        onClick={() => {
                          handleRemoveFilter('buildings', i);
                        }}
                      />
                    ))}

                    {dataFilter.categories.length === 0 && (
                      <ListTag
                        padding="4px 12px"
                        fontWeight={500}
                        label="Todas as categorias"
                        backgroundColor="primary"
                      />
                    )}

                    {dataFilter.categories.map((e, i) => (
                      <ListTag
                        backgroundColor="primary"
                        padding="4px 12px"
                        fontWeight={500}
                        label={e}
                        key={e}
                        onClick={() => {
                          handleRemoveFilter('categories', i);
                        }}
                      />
                    ))}

                    {dataFilter.responsible.length === 0 && (
                      <ListTag
                        padding="4px 12px"
                        fontWeight={500}
                        label="Todos os responsáveis"
                        backgroundColor="primary"
                      />
                    )}

                    {dataFilter.responsible.map((e, i) => (
                      <ListTag
                        padding="4px 12px"
                        backgroundColor="primary"
                        fontWeight={500}
                        label={e}
                        key={e}
                        onClick={() => {
                          handleRemoveFilter('responsible', i);
                        }}
                      />
                    ))}
                  </Style.Tags>
                </Style.FilterWrapper>
              </Form>
            )}
          </Formik>
        </Style.FilterSection>

        <Style.Wrappers>
          <Style.MaintenancesCounts>
            <Style.CountCard>
              <h5>Manutenções avulsas</h5>

              <Style.CountCardContent>
                {dashboardLoadings.maintenances ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{maintenancesData.occasionalMaintenanceData.count}</h2>
                    <p className="p4">{maintenancesData.occasionalMaintenanceData.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Manutenções preventivas</h5>

              <Style.CountCardContent>
                {dashboardLoadings.maintenances ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{maintenancesData.commonMaintenanceData.count}</h2>
                    <p className="p4">{maintenancesData.commonMaintenanceData.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Total de manutenções</h5>

              <Style.CountCardContent>
                {dashboardLoadings.maintenances ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{maintenancesData.totalMaintenanceData.count}</h2>
                    <p className="p4">{maintenancesData.totalMaintenanceData.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Total de chamados</h5>

              <Style.CountCardContent>
                {dashboardLoadings.tickets ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{totalTicketsCount}</h2>
                    <p className="p4">
                      Em aberto: {ticketsData.openTickets.count} / Em progresso:{' '}
                      {ticketsData.awaitingToFinishTickets.count} / Finalizados:{' '}
                      {ticketsData.finishedTickets.count} / Indeferidos:{' '}
                      {ticketsData.dismissedTickets.count}
                    </p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>
          </Style.MaintenancesCounts>

          {/* <Style.TicketsCounts>
            <Style.CountCard>
              <h5>Chamados abertos</h5>

              <Style.CountCardContent>
                {dashboardLoadings.tickets ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{ticketsData.openTickets.count}</h2>
                    <p className="p4">{ticketsData.openTickets.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Chamados pendentes</h5>

              <Style.CountCardContent>
                {dashboardLoadings.tickets ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{ticketsData.awaitingToFinishTickets.count}</h2>
                    <p className="p4">{ticketsData.awaitingToFinishTickets.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Chamados finalizados</h5>

              <Style.CountCardContent>
                {dashboardLoadings.tickets ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{ticketsData.finishedTickets.count}</h2>
                    <p className="p4">{ticketsData.finishedTickets.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Chamados indeferidos</h5>

              <Style.CountCardContent>
                {dashboardLoadings.tickets ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    <h2>{ticketsData.dismissedTickets.count}</h2>
                    <p className="p4">{ticketsData.dismissedTickets.cost}</p>
                  </>
                )}
              </Style.CountCardContent>
            </Style.CountCard>
          </Style.TicketsCounts> */}

          <Style.ChartsWrapper>
            <Style.Card>
              <h5>Linha do tempo de manutenções</h5>

              <Style.ChartContent>
                {dashboardLoadings.timeline ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    {maintenancesTimeline.series.length > 0 &&
                      maintenancesTimeline.series[0].data.length > 0 && (
                        <Style.ChartWrapperX
                          onScroll={handleScroll}
                          scrollLeft={scrollLeft}
                          ref={refCallback}
                        >
                          <Chart
                            options={timeLineChart.options}
                            series={timeLineChart.series}
                            type="bar"
                            height={290}
                            width={Math.max(
                              divWidth,
                              (maintenancesTimeline.series[0].data.length +
                                maintenancesTimeline.series[1].data.length +
                                maintenancesTimeline.series[2].data.length) *
                                30,
                            )}
                          />
                        </Style.ChartWrapperX>
                      )}

                    {maintenancesTimeline.series.length > 0 &&
                      maintenancesTimeline.series[0].data.length === 0 && (
                        <Style.NoDataWrapper>
                          <h6>Nenhuma informação encontrada</h6>
                        </Style.NoDataWrapper>
                      )}
                  </>
                )}
              </Style.ChartContent>
            </Style.Card>

            <Style.PieWrapper>
              <Style.Card>
                <h5>Score de manutenções</h5>

                <Style.ChartContent>
                  {dashboardLoadings.score ? (
                    <DotSpinLoading />
                  ) : (
                    <>
                      {maintenanceChart.data.some((data) => data > 0) && (
                        <Chart
                          type="donut"
                          options={scoreChart.options as any}
                          series={scoreChart.series}
                          height={335}
                        />
                      )}

                      {maintenanceChart.data[0] === 0 &&
                        maintenanceChart.data[1] === 0 &&
                        maintenanceChart.data[2] === 0 && (
                          <Style.NoDataWrapper>
                            <h6>Nenhuma informação encontrada</h6>
                          </Style.NoDataWrapper>
                        )}
                    </>
                  )}
                </Style.ChartContent>
              </Style.Card>

              <Style.Card>
                <h5>Tipos de chamados</h5>

                <Style.ChartContent>
                  {dashboardLoadings.ticketTypes ? (
                    <DotSpinLoading />
                  ) : (
                    <>
                      {ticketsServicesTypeChart.data.length > 0 && (
                        <Chart
                          type="donut"
                          options={ticketTypesChart.options as any}
                          series={ticketTypesChart.series}
                          height={335}
                        />
                      )}

                      {ticketsServicesTypeChart.data.length === 0 && (
                        <Style.NoDataWrapper>
                          <h6>Nenhuma informação encontrada</h6>
                        </Style.NoDataWrapper>
                      )}
                    </>
                  )}
                </Style.ChartContent>
              </Style.Card>
            </Style.PieWrapper>
          </Style.ChartsWrapper>

          <Style.PanelWrapper>
            <Style.Card>
              <h5>Investido em manutenções</h5>

              {dashboardLoadings.maintenances ? (
                <DotSpinLoading />
              ) : (
                <Style.CardContent>
                  <h2>{maintenancesData.totalMaintenanceData.cost.slice(16) || 'R$ 0,00'}</h2>
                </Style.CardContent>
              )}
            </Style.Card>

            <Style.Card>
              <h5>Manutenções mais realizadas</h5>

              <Style.CardContent>
                {dashboardLoadings.mostCompletedExpired ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    {maintenancesMostCompletedExpired?.completed?.map((rating) => (
                      <Style.MostAccomplishedMaintenance
                        key={rating.id}
                        onClick={() => {
                          handleSelectedMaintenance(rating, 'completed');
                        }}
                      >
                        <h6>{rating.data.Category.name}</h6>
                        <p className="p2" title={rating.data.activity}>
                          {rating.data.activity}
                        </p>
                        <p className="p3">
                          A cada{' '}
                          {rating.data.frequency > 1
                            ? `${rating.data.frequency} ${rating.data.FrequencyTimeInterval.pluralLabel}`
                            : `${rating.data.frequency} ${rating.data.FrequencyTimeInterval.singularLabel}`}
                        </p>
                      </Style.MostAccomplishedMaintenance>
                    ))}

                    {maintenancesMostCompletedExpired?.completed?.length === 0 && (
                      <h6>Nenhuma informação encontrada</h6>
                    )}
                  </>
                )}
              </Style.CardContent>
            </Style.Card>

            <Style.Card>
              <h5>Manutenções menos realizadas</h5>

              <Style.CardContent>
                {dashboardLoadings.mostCompletedExpired ? (
                  <DotSpinLoading />
                ) : (
                  <>
                    {maintenancesMostCompletedExpired?.expired?.map((rating) => (
                      <Style.LeastAccomplishedMaintenance
                        key={rating.id}
                        onClick={() => {
                          handleSelectedMaintenance(rating, 'expired');
                        }}
                      >
                        <h6>{rating.data.Category.name}</h6>
                        <p className="p2" title={rating.data.activity}>
                          {rating.data.activity}
                        </p>
                        <p className="p3">
                          A cada{' '}
                          {rating.data.frequency > 1
                            ? `${rating.data.frequency} ${rating.data.FrequencyTimeInterval.pluralLabel}`
                            : `${rating.data.frequency} ${rating.data.FrequencyTimeInterval.singularLabel}`}
                        </p>
                      </Style.LeastAccomplishedMaintenance>
                    ))}

                    {maintenancesMostCompletedExpired?.expired?.length === 0 && (
                      <h6>Nenhuma informação encontrada</h6>
                    )}
                  </>
                )}
              </Style.CardContent>
            </Style.Card>
          </Style.PanelWrapper>
        </Style.Wrappers>
      </Style.Container>
    </>
  );
};
