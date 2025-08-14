// #region imports

// REACT
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Chart from 'react-apexcharts';

// LIBS
import { Form, Formik } from 'formik';
import { ApexOptions } from 'apexcharts';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// SERVICES
import { getMaintenancesKanban } from '@services/apis/getMaintenancesKanban';
import { getDashboardFilters } from '@services/apis/getDashboardFilters';
import { getMaintenancesCountAndCost } from '@services/apis/getMaintenancesCountAndCost';
import { getTicketsCountAndCost } from '@services/apis/getTicketsCountAndCost';
import { getTicketsByServiceTypes } from '@services/apis/getTicketsByServiceTypes';
import { getMaintenancesTimeline } from '@services/apis/getMaintenancesTimeline';
import { getTicketsByBuildingNanoId } from '@services/apis/getTicketsByBuildingNanoId';
import { getMaintenanceStatus } from '@services/apis/getMaintenancesStatus';
import { getMaintenanceCategories } from '@services/apis/getMaintenancesCategories';
import { getUserActivities, UserActivity } from '@services/apis/getUserActivities';

// GLOBAL COMPONENTS
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';
import { FormikInput } from '@components/Form/FormikInput';
import { ModalMaintenanceReportSend } from '@components/MaintenanceModals/ModalMaintenanceReportSend';
import { ModalMaintenanceDetails } from '@components/MaintenanceModals/ModalMaintenanceDetails';
import ModalTicketDetails from '@screens/Tickets/ModalTicketDetails';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { ITicketStatusNames } from '@customTypes/ITicket';
import type { TModalNames } from '@customTypes/TModalNames';
import type { TMaintenanceStatus } from '@customTypes/TMaintenanceStatus';
import { useReactToPrint } from 'react-to-print';

// COMPONENTS
import { InfoCard } from './Components/InfoCard';
import { ReusableChartCard } from './Components/Graphic';

// STYLES
import * as Style from './styles';
// #endregion

// #region interfaces
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
  maintenancesCountAndCost: boolean;
  ticketsCountAndCost: boolean;
  timeline: boolean;
  maintenancesScore: boolean;
  ticketsTypes: boolean;
  maintenancesCategories: boolean;
  userActivities: boolean;
}

type CountAndCostItem = {
  category: string;
  count: number;
};

export interface ITicketFilter {
  startDate?: string;
  endDate?: string;
  edification: string[];
  category: string[];
  responsible: string[];
  seen: string;
}
// #endregion

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

export const Dashboard = () => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });
  const dashboardRef = useRef<HTMLDivElement>(null);

  // #region states
  const [kanban, setKanban] = useState<any[]>([]);

  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const [allTickets, setAllTickets] = useState<any[]>([]);

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

  const [ticketsServicesTypeChart, setTicketsServicesTypeChart] = useState<{
    data: number[];
    labels: string[];
    colors: string[];
    ticketsByType?: Record<string, any[]>;
  }>({
    data: [],
    labels: [],
    colors: [],
    ticketsByType: {},
  });

  const dataFilterInitialValues: IDashboardFilter = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    buildings: [],
    categories: [],
  };

  const handlePrint = useReactToPrint({
    content: () => dashboardRef.current,
    documentTitle: 'Dashboard',
    removeAfterPrint: true,
    onBeforeGetContent: () => {
      window.dispatchEvent(new Event('resize'));
      return Promise.resolve();
    },
  });

  const [dataFilter, setDataFilter] = useState<IDashboardFilter>(dataFilterInitialValues);

  const [maintenanceChart, setMaintenanceChart] = useState<{
    common: any;
    occasional: any;
  }>({
    common: { emptyChart },
    occasional: { emptyChart },
  });

  const [categoriesFormatted, setCategoriesFormatted] = useState<{
    common: CountAndCostItem[];
    occasional: CountAndCostItem[];
  }>({
    common: [],
    occasional: [],
  });

  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  const filteredUsers = userActivities.filter((user) => user.name?.trim() !== '');

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    buildings: [],
    categories: [],
  });

  const [scrollLeft, setScrollLeft] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [modalMaintenanceReportSend, setModalMaintenanceReportSend] = useState<boolean>(false);
  const [modalMaintenanceDetails, setModalMaintenanceDetails] = useState<boolean>(false);
  const [modalTicketDetails, setModalTicketDetails] = useState<boolean>(false);

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardLoadings, setDashboardLoadings] = useState<IDashboardLoadings>({
    maintenancesCountAndCost: true,
    ticketsCountAndCost: true,
    timeline: true,
    maintenancesScore: true,
    ticketsTypes: true,
    maintenancesCategories: true,
    userActivities: true,
  });
  // #endregion

  // #region helpers/utils
  const totalTicketsCount =
    ticketsData.openTickets.count +
    ticketsData.awaitingToFinishTickets.count +
    ticketsData.finishedTickets.count +
    ticketsData.dismissedTickets.count;

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

  function normalize(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  const handleModals = (modal: TModalNames, modalState: boolean) => {
    switch (modal) {
      case 'modalMaintenanceReportSend':
        setModalMaintenanceReportSend(modalState);
        break;

      case 'modalMaintenanceDetails':
        setModalMaintenanceDetails(modalState);
        break;

      case 'modalTicketDetails':
        setModalTicketDetails(modalState);
        break;

      default:
        break;
    }
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleSelectMaintenance = (
    maintenanceId: string,
    maintenanceStatus: TMaintenanceStatus,
    cantReportMaintenance: boolean,
  ) => {
    setSelectedMaintenanceId(maintenanceId);

    if (
      maintenanceStatus === 'completed' ||
      maintenanceStatus === 'overdue' ||
      (maintenanceStatus === 'expired' && cantReportMaintenance)
    ) {
      handleModals('modalMaintenanceDetails', true);
    } else {
      handleModals('modalMaintenanceReportSend', true);
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    handleModals('modalTicketDetails', true);
  };
  // #endregion

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

  const handleGetKanban = async () => {
    try {
      const kanbanFilter = {
        ...dataFilter,
        status: [],
        users: [],
        type: [],
        priorityNames: [],
        types: [],
        search: '',
      };

      const response = await getMaintenancesKanban({
        userId: '',
        filter: kanbanFilter,
      });
      setKanban(response.kanban);
    } catch (error: any) {
      handleToastify(error.response?.data?.ServerMessage);
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

      const categories: CountAndCostItem[] = responseData.categoriesArray.map(
        (item: CountAndCostItem) => ({
          category: item.category,
          count: item.count,
        }),
      );

      setCategoriesFormatted((prev) => ({
        ...prev,
        [maintenanceType]: categories,
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
      const largest = findLargestValueAndIndex(responseData.data);

      const chartData = {
        series: responseData.data,
        options: {
          labels: responseData.labels,
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
                    label: responseData.labels[largest.index],
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
          colors: responseData.colors,
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

      if (maintenanceType === 'common') {
        setMaintenanceChart((prevState) => ({
          ...prevState,
          common: chartData,
        }));
      } else {
        setMaintenanceChart((prevState) => ({
          ...prevState,
          occasional: chartData,
        }));
      }
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const handleGetAllMaintenanceStatus = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, maintenancesScore: true }));

    try {
      await Promise.all([
        handleGetMaintenanceStatus('common', resetFilters),
        handleGetMaintenanceStatus('occasional', resetFilters),
        handleGetKanban(),
      ]);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, maintenancesScore: false }));
    }
  };

  const handleGetAllMaintenanceCategories = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, maintenancesCategories: true }));

    try {
      await Promise.all([
        handleGetMaintenanceCategories('common', resetFilters),
        handleGetMaintenanceCategories('occasional', resetFilters),
      ]);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, maintenancesCategories: false }));
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
      }
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  const handleGetTicketsByServiceType = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, ticketsTypes: true }));

    try {
      const responseData = await getTicketsByServiceTypes(dataFilter, resetFilters);

      setTicketsServicesTypeChart(responseData);
      setDashboardLoadings((prevState) => ({ ...prevState, ticketsTypes: false }));
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
      setDashboardLoadings((prevState) => ({ ...prevState, ticketsTypes: false }));
    }
  };

  const handleGetMaintenancesTimeline = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, timeline: true }));

    try {
      const responseData = await getMaintenancesTimeline(dataFilter, resetFilters);

      setMaintenancesTimeline(responseData);
      setDashboardLoadings((prevState) => ({ ...prevState, timeline: false }));
    } catch (error: any) {
      handleToastify(error.response);
      setDashboardLoadings((prevState) => ({ ...prevState, timeline: false }));
    }
  };

  const handleGetUserActivities = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, userActivities: true }));

    try {
      const responseData = await getUserActivities(dataFilter, resetFilters);

      setUserActivities(responseData);
      setDashboardLoadings((prevState) => ({ ...prevState, userActivities: false }));
    } catch (error: any) {
      handleToastify(error.response);
      setDashboardLoadings((prevState) => ({ ...prevState, userActivities: false }));
    }
  };
  // #endregion

  // #region dashboard functions
  const handleGetAllMaintenancesCountAndCost = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, maintenancesCountAndCost: true }));

    try {
      await Promise.all([
        handleGetMaintenancesCountAndCost('', resetFilters),
        handleGetMaintenancesCountAndCost('common', resetFilters),
        handleGetMaintenancesCountAndCost('occasional', resetFilters),
      ]);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, maintenancesCountAndCost: false }));
    }
  };

  const handleGetAllTicketsCountAndCost = async (resetFilters?: boolean) => {
    setDashboardLoadings((prevState) => ({ ...prevState, ticketsCountAndCost: true }));

    try {
      await Promise.all([
        handleGetTicketsCountAndCost('', resetFilters),
        handleGetTicketsCountAndCost('open', resetFilters),
        handleGetTicketsCountAndCost('awaitingToFinish', resetFilters),
        handleGetTicketsCountAndCost('finished', resetFilters),
        handleGetTicketsCountAndCost('dismissed', resetFilters),
      ]);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setDashboardLoadings((prevState) => ({ ...prevState, ticketsCountAndCost: false }));
    }
  };

  const handleGetDashboardData = async (resetFilters?: boolean) => {
    // get count and cost from all maintenance types
    handleGetAllMaintenancesCountAndCost(resetFilters);

    // get count and cost from all ticket status
    handleGetAllTicketsCountAndCost(resetFilters);

    // get maintenance timeline
    handleGetMaintenancesTimeline(resetFilters);

    // get maintenance status (common and occasional)
    handleGetAllMaintenanceStatus(resetFilters);

    // get ticket types
    handleGetTicketsByServiceType(resetFilters);

    // get maintenance categories (common and occasional)
    handleGetAllMaintenanceCategories(resetFilters);

    // get users activities
    handleGetUserActivities(resetFilters);
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

  const labels = ['Concluídas', 'Vencidas', 'Pendentes', 'Em andamento'];
  const ticketLabels = ticketsServicesTypeChart.labels;

  const activitiesByLabelCommon = labels.reduce((acc: Record<string, any[]>, label: string) => {
    if (label === 'Em andamento') {
      acc[label] = kanban
        .flatMap((col: any) => col.maintenances || [])
        .filter((m: any) => m.type === 'common' && m.inProgress);
    } else {
      const column = kanban.find((col: any) => col.status === label);
      acc[label] = column
        ? (column.maintenances || []).filter((m: any) => m.type === 'common' && !m.inProgress)
        : [];
    }
    return acc;
  }, {});

  const activitiesByLabelOccasional = labels.reduce((acc: Record<string, any[]>, label: string) => {
    if (label === 'Em andamento') {
      acc[label] = kanban
        .flatMap((col: any) => col.maintenances || [])
        .filter((m: any) => m.type === 'occasional' && m.inProgress);
    } else {
      const column = kanban.find((col: any) => col.status === label);
      acc[label] = column
        ? (column.maintenances || []).filter((m: any) => m.type === 'occasional' && !m.inProgress)
        : [];
    }
    return acc;
  }, {});

  const activitiesByLabelTickets = useMemo(
    () =>
      ticketsServicesTypeChart.labels.reduce((acc: Record<string, any[]>, label) => {
        acc[label] = allTickets.filter((ticket) =>
          ticket.types?.some((typeObj: any) => normalize(typeObj.type.label) === normalize(label)),
        );
        return acc;
      }, {}),
    [allTickets, ticketsServicesTypeChart.labels],
  );

  // #region useEffects

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await getTicketsByBuildingNanoId({
          filter: {
            buildings: dataFilter.buildings || [],
            status: [],
            places: [],
            serviceTypes: [],
            apartments: [],
            startDate: dataFilter.startDate,
            endDate: dataFilter.endDate,
            seen: '',
          },
          take: 1000,
        });
        setAllTickets(response.tickets || []);
      } catch (error: any) {
        handleToastify(error?.response?.data?.ServerMessage || 'Erro ao buscar tickets');
      }
    };

    fetchAllTickets();
  }, [dataFilter]);

  useEffect(() => {
    handleGetDashboardFilters();
    handleGetDashboardData();
  }, []);

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
      dashboardLoadings.maintenancesCountAndCost ||
      dashboardLoadings.ticketsCountAndCost ||
      dashboardLoadings.timeline ||
      dashboardLoadings.maintenancesScore ||
      dashboardLoadings.ticketsTypes
    ) {
      setOnQuery(true);
    } else {
      setOnQuery(false);
    }
  }, [dashboardLoadings]);
  // #endregion

  return loading ? (
    <DotSpinLoading />
  ) : (
    <div ref={dashboardRef}>
      <Style.Container>
        <Style.TopBar>
          <h2>Dashboard</h2>
          <Button label="Imprimir" type="button" onClick={handlePrint} />
        </Style.TopBar>

        <Style.FilterSection>
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
                        value={building.id}
                        disabled={dataFilter.buildings.some((e) => e === building.id)}
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
                </Style.FilterWrapper>

                <Style.FilterWrapperFooter>
                  <Style.Tags>
                    {dataFilter.buildings.length === 0 ? (
                      <ListTag
                        label="Todas as edificações"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    ) : (
                      dataFilter.buildings.map((e, i) => (
                        <ListTag
                          key={e}
                          label={buildingsForSelect.find((b) => b.id === e)?.name || ''}
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                          onClick={() => handleRemoveFilter('buildings', i)}
                        />
                      ))
                    )}

                    {dataFilter.categories.length === 0 ? (
                      <ListTag
                        label="Todas as categorias"
                        color="white"
                        backgroundColor="primaryM"
                        fontWeight={500}
                        padding="4px 12px"
                      />
                    ) : (
                      dataFilter.categories.map((e, i) => (
                        <ListTag
                          key={e}
                          label={e}
                          color="white"
                          backgroundColor="primaryM"
                          fontWeight={500}
                          padding="4px 12px"
                          onClick={() => handleRemoveFilter('categories', i)}
                        />
                      ))
                    )}
                  </Style.Tags>

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
                </Style.FilterWrapperFooter>
              </Form>
            )}
          </Formik>
        </Style.FilterSection>

        <Style.Wrappers>
          {modalMaintenanceReportSend && selectedMaintenanceId && (
            <ModalMaintenanceReportSend
              maintenanceHistoryId={selectedMaintenanceId}
              refresh={refresh}
              handleModals={handleModals}
              handleRefresh={handleRefresh}
            />
          )}

          {modalMaintenanceDetails && selectedMaintenanceId && (
            <ModalMaintenanceDetails
              modalAdditionalInformations={{
                id: selectedMaintenanceId,
                expectedDueDate: '',
                expectedNotificationDate: '',
                isFuture: false,
              }}
              handleModals={handleModals}
              handleRefresh={handleRefresh}
            />
          )}

          {modalTicketDetails && selectedTicketId && (
            <ModalTicketDetails
              ticketId={selectedTicketId}
              handleTicketDetailsModal={(open: boolean) => {
                if (!open) {
                  setModalTicketDetails(false);
                  setSelectedTicketId(null);
                }
              }}
            />
          )}

          <Style.MaintenancesCounts>
            <Style.CountCard>
              {dashboardLoadings.maintenancesCountAndCost ? (
                <DotSpinLoading />
              ) : (
                <>
                  <h5>Total de manutenções</h5>

                  <Style.CountCardContent>
                    <>
                      <h2>{maintenancesData.totalMaintenanceData.count}</h2>
                      <p className="p4">{maintenancesData.totalMaintenanceData.cost}</p>
                    </>
                  </Style.CountCardContent>
                </>
              )}
            </Style.CountCard>

            <Style.CountCard>
              {dashboardLoadings.maintenancesCountAndCost ? (
                <DotSpinLoading />
              ) : (
                <>
                  <h5>Manutenções preventivas</h5>

                  <Style.CountCardContent>
                    <>
                      <h2>{maintenancesData.commonMaintenanceData.count}</h2>
                      <p className="p4">{maintenancesData.commonMaintenanceData.cost}</p>
                    </>
                  </Style.CountCardContent>
                </>
              )}
            </Style.CountCard>

            <Style.CountCard>
              {dashboardLoadings.maintenancesCountAndCost ? (
                <DotSpinLoading />
              ) : (
                <>
                  <h5>Manutenções avulsas</h5>

                  <Style.CountCardContent>
                    <>
                      <h2>{maintenancesData.occasionalMaintenanceData.count}</h2>
                      <p className="p4">{maintenancesData.occasionalMaintenanceData.cost}</p>
                    </>
                  </Style.CountCardContent>
                </>
              )}
            </Style.CountCard>

            <Style.CountCard>
              {dashboardLoadings.ticketsCountAndCost ? (
                <DotSpinLoading />
              ) : (
                <>
                  <h5>Total de chamados</h5>

                  <Style.CountCardContent>
                    <>
                      <h2>{totalTicketsCount}</h2>
                      <p className="p4">
                        Em aberto: {ticketsData.openTickets.count} / Em progresso:{' '}
                        {ticketsData.awaitingToFinishTickets.count} / Finalizados:{' '}
                        {ticketsData.finishedTickets.count} / Indeferidos:{' '}
                        {ticketsData.dismissedTickets.count}
                      </p>
                    </>
                  </Style.CountCardContent>
                </>
              )}
            </Style.CountCard>
          </Style.MaintenancesCounts>

          <Style.ChartsWrapper>
            <Style.TimelineCard>
              {dashboardLoadings.timeline ? (
                <DotSpinLoading />
              ) : (
                <>
                  <h5>Linha do tempo de manutenções</h5>

                  <Style.ChartContent>
                    <>
                      {maintenancesTimeline.series.length > 0 &&
                        maintenancesTimeline.series[0].data.length > 0 && (
                          <Style.ChartWrapperX
                            onScroll={handleScroll}
                            ref={refCallback}
                            shouldFill={timeLineChart.series[0].data.length < 3}
                          >
                            <Chart
                              options={timeLineChart.options}
                              series={timeLineChart.series}
                              type="bar"
                              height={
                                timeLineChart.series[0].data?.length < 3
                                  ? 300
                                  : timeLineChart.series[0].data.length * 80
                              }
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
                  </Style.ChartContent>
                </>
              )}
            </Style.TimelineCard>

            <Style.PieWrapper>
              <ReusableChartCard
                title="Score de manutenções preventivas"
                type="donut"
                height={250}
                chartOptions={maintenanceChart.common.options}
                chartSeries={maintenanceChart.common.series}
                isLoading={dashboardLoadings.maintenancesScore}
                activitiesByLabel={activitiesByLabelCommon}
                handleSelectMaintenance={handleSelectMaintenance}
              />

              <ReusableChartCard
                title="Score de manutenções avulsas"
                type="donut"
                height={250}
                chartOptions={maintenanceChart.occasional.options}
                chartSeries={maintenanceChart.occasional.series}
                isLoading={dashboardLoadings.maintenancesScore}
                activitiesByLabel={activitiesByLabelOccasional}
                handleSelectMaintenance={handleSelectMaintenance}
              />

              <ReusableChartCard
                title="Tipos de chamados"
                type="donut"
                height={250}
                chartOptions={ticketTypesChart.options}
                chartSeries={ticketTypesChart.series}
                isLoading={dashboardLoadings.ticketsTypes}
                activitiesByLabel={activitiesByLabelTickets}
                typePopover="ticket"
                handleSelectTicket={handleSelectTicket}
              />

              <InfoCard
                title="Manutenções preventivas"
                categories={categoriesFormatted.common || []}
              />

              <InfoCard
                title="Manutenções avulsas"
                categories={categoriesFormatted.occasional || []}
              />

              <InfoCard
                title="Atividades por usuário"
                totals={filteredUsers.reduce((acc, user) => acc + user.totalActivities, 0)}
                names={filteredUsers.map((user) => ({
                  name: user.name,
                  number: user.totalActivities,
                }))}
              />
            </Style.PieWrapper>
          </Style.ChartsWrapper>
        </Style.Wrappers>
      </Style.Container>
    </div>
  );
};
