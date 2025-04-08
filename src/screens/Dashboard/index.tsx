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
import { ApexOptions } from 'apexcharts';
import { InfoCard } from './Components/InfoCard';
import { ModalDashboardMaintenanceDetails } from './ModalDashboardMaintenanceDetails';

// STYLES
import * as Style from './styles';
import { ReusableChartCard } from './Components/Graphic';
import { UserActivity } from './Components/InfoCard/utils/types';
import {
  getMaintenanceCategories,
  getMaintenanceStatus,
  getUserActivities,
} from './Components/InfoCard/utils/functions';
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
}

interface IFilterOptions {
  buildings: string[];
  categories: string[];
}

type IFilterTypes = 'startDate' | 'endDate' | 'buildings' | 'categories';

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

interface StatusChartData {
  data: number[];
  labels: string[];
  colors: string[];
}

type CountAndCostItem = {
  category: string;
  count: number;
};

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
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

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
    startDate: new Date(new Date().setDate(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    buildings: [],
    categories: [],
  };

  const [dataFilter, setDataFilter] = useState<IDashboardFilter>(dataFilterInitialValues);

  const handleGetUserActivities = async () => {
    try {
      const response = await getUserActivities(dataFilter);
      setUserActivities(response);
    } catch (error) {
      setUserActivities([]);
    }
  };
  useEffect(() => {
    handleGetUserActivities();
  }, []);

  const filteredUsers = userActivities.filter((user) => user.name?.trim() !== '');
  const firstUser = filteredUsers[0] || null;

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    buildings: [],
    categories: [],
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

  const [maintenanceChart, setMaintenanceChart] = useState<{
    common: StatusChartData;
    occasional: StatusChartData;
  }>({
    common: { data: [], labels: [], colors: [] },
    occasional: { data: [], labels: [], colors: [] },
  });

  const [categoriesFormatted, setCategoriesFormatted] = useState<{
    common: CountAndCostItem[];
    occasional: CountAndCostItem[];
  }>({
    common: [],
    occasional: [],
  });

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

  const handleGetMaintenanceCategories = async (
    maintenanceType: 'common' | 'occasional',
    resetFilters?: boolean,
  ) => {
    try {
      const responseData = await getMaintenanceCategories(
        dataFilter,
        maintenanceType,
        resetFilters,
      );

      if (!responseData?.categoriesArray) return;

      const categories = responseData.categoriesArray.map((item) => ({
        category: item.category,
        count: item.count,
      }));

      setCategoriesFormatted((prev) => ({
        ...prev,
        [maintenanceType]: categories,
      }));

      setMaintenancesData((prev) => ({
        ...prev,
        [`${maintenanceType}MaintenanceData`]: {
          count: Number(responseData.totalMaintenances),
          cost: Number(responseData.totalCost),
        },
      }));
    } catch (error: any) {
      handleToastify(error.response?.data?.ServerMessage);
    }
  };

  const handleGetMaintenanceStatus = async (
    maintenanceType: 'common' | 'occasional',
    resetFilters?: boolean,
  ) => {
    try {
      const responseData = await getMaintenanceStatus(dataFilter, maintenanceType, resetFilters);

      if (!responseData) return;

      if (maintenanceType === 'common') {
        setMaintenanceChart((prevState) => ({
          ...prevState,
          common: responseData,
        }));
      } else {
        setMaintenanceChart((prevState) => ({
          ...prevState,
          occasional: responseData,
        }));
      }
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const handleGetAllMaintenanceStatus = async (resetFilters?: boolean) => {
    try {
      await handleGetMaintenanceStatus('common', resetFilters);
      await handleGetMaintenanceStatus('occasional', resetFilters);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const handleGetAllMaintenanceCategories = async (resetFilters?: boolean) => {
    try {
      handleGetMaintenanceCategories('common', resetFilters);
      handleGetMaintenanceCategories('occasional', resetFilters);
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

    // get maintenance status (common and occasional)
    handleGetAllMaintenanceStatus(resetFilters);

    // get maintenance categories (common and occasional)
    handleGetAllMaintenanceCategories(resetFilters);
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

  // const handleSelectedMaintenance = (rating: IRating, status: IRatingStatus) => {
  //   setSelectedRating(rating);
  //   setSelectedRatingStatus(status);
  //   setModalDashboardMaintenanceDetails(true);
  // };
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
          horizontal: true,
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
          formatter: (value: number) => value.toLocaleString('pt-BR'),
        },
      },

      yaxis: {
        labels: {
          formatter: (value: number) => value.toLocaleString('pt-BR'),
        },
      },

      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },

      xaxis: {
        categories: maintenancesTimeline.categories,
        labels: {
          formatter: (value: string) => value,
        },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },
      fill: { opacity: 1 },
    } as ApexOptions,
  };

  const scoreChart = (type: 'common' | 'occasional') => {
    const chartData = maintenanceChart?.[type];

    if (type === 'occasional') console.log('chartData', chartData);

    const emptyChart = {
      series: [],
      chartData: [],
      options: {
        labels: [],
        chart: { toolbar: { show: false } },
        tooltip: { enabled: true },
        plotOptions: {
          pie: {
            donut: { labels: { show: false } },
          },
        },
        colors: [],
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

    if (!chartData || !chartData.data?.length || !chartData.labels?.length) {
      return emptyChart;
    }

    const largest = findLargestValueAndIndex(chartData.data);

    return {
      series: chartData.data,
      options: {
        labels: chartData.labels,
        chart: { toolbar: { show: false } },
        tooltip: { enabled: true },
        plotOptions: {
          pie: {
            startAngle: 0,
            endAngle: 360,
            expandOnClick: true,
            offsetX: 0,
            offsetY: 0,
            customScale: 1,
            dataLabels: { offset: 0, minAngleToShowLabel: 10 },
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
                  label: chartData.labels[largest.index],
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000',
                  formatter(w: any) {
                    const percent =
                      (w.globals.seriesTotals[largest.index] * 100) /
                      w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                    return `${percent.toFixed(1)} %`;
                  },
                },
              },
            },
          },
        },
        colors: chartData.colors,
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
              startDate: new Date(new Date().setMonth(new Date().getMonth() - 3))
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

                    <Button label="Filtrar" type="submit" loading={onQuery} bgColor="primary" />
                  </Style.ButtonWrapper>

                  <Style.Tags>
                    {dataFilter.buildings.length === 0 && (
                      <ListTag
                        label="Todas as edificações"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    )}

                    {dataFilter.buildings.map((e, i) => (
                      <ListTag
                        key={e}
                        label={e}
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                        onClick={() => handleRemoveFilter('buildings', i)}
                      />
                    ))}

                    {dataFilter.categories.length === 0 && (
                      <ListTag
                        label="Todas as categorias"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    )}

                    {dataFilter.categories.map((e, i) => (
                      <ListTag
                        key={e}
                        label={e}
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                        onClick={() => handleRemoveFilter('categories', i)}
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
                            height="100%"
                            width="100%"
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
                <ReusableChartCard
                  title="Score de manutenções preventiva"
                  type="donut"
                  chartOptions={scoreChart('common').options}
                  chartSeries={scoreChart('common').series}
                  isLoading={dashboardLoadings.score}
                />
              </Style.Card>

              <Style.Card>
                <ReusableChartCard
                  title="Score de manutenções avulsas"
                  type="donut"
                  chartOptions={scoreChart('occasional').options}
                  chartSeries={scoreChart('occasional').series}
                  isLoading={dashboardLoadings.score}
                />
              </Style.Card>

              <Style.Card>
                <ReusableChartCard
                  title="Tipos de chamados"
                  type="donut"
                  chartOptions={ticketTypesChart.options}
                  chartSeries={ticketTypesChart.series}
                  isLoading={dashboardLoadings.ticketTypes}
                />
              </Style.Card>

              <InfoCard
                title="Manutenções Preventivas"
                totals={maintenancesData?.commonMaintenanceData.count || 0}
                valueInvested={Number(maintenancesData?.commonMaintenanceData.cost) || 0}
                categories={categoriesFormatted.common || 0}
              />

              <InfoCard
                title="Manutenções Avulsas"
                totals={maintenancesData?.occasionalMaintenanceData.count || 0}
                valueInvested={Number(maintenancesData?.occasionalMaintenanceData.cost) || 0}
                categories={categoriesFormatted.occasional || 0}
              />

              <InfoCard
                title="Atividades por usuário"
                totals={firstUser?.totalActivities || 0}
                valueInvested={firstUser?.maintenanceHistoryCount || 0}
                name={filteredUsers.map((user) => user.name)}
                tickets={firstUser?.ticketCount || 0}
                checklists={firstUser?.checklistCount || 0}
              />
            </Style.PieWrapper>
          </Style.ChartsWrapper>
        </Style.Wrappers>
      </Style.Container>
    </>
  );
};
