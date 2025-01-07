// #region imports
import { useEffect, useState, useRef, useCallback } from 'react';

import Chart from 'react-apexcharts';

import { Api } from '@services/api';
import { getMaintenancesCountAndCost } from '@services/apis/getMaintenancesCountAndCost';

import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { ListTag } from '@components/ListTag';

import { catchHandler } from '@utils/functions';

import type { ITicketStatusNames } from '@customTypes/ITicket';

import { getTicketsCountAndCost } from '@services/apis/getTicketsCountAndCost';
import { getTicketsByServiceTypes } from '@services/apis/getTicketsByServiceTypes';
import { getMaintenancesByStatus } from '@services/apis/getMaintenancesByStatus';
import { getMaintenancesTimeline } from '@services/apis/getMaintenancesTimeline';
import { ModalDashboardMaintenanceDetails } from './ModalDashboardMaintenanceDetails';

import * as Style from './styles';
// #endregion

// #region interfaces
export interface IDashboardFilter {
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
  responsibles: string[];
  periods: IPeriods[];
}

type IFilterTypes = 'buildings' | 'categories' | 'responsible';

interface ITimeline {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

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

interface IRating {
  allCount: number;
  count: number;
  data: IMaintenance;
  id: string;
  rating: number;
}

interface IMaintenanceData {
  completed: IRating[];
  expired: IRating[];
}

type IRatingStatus = '' | 'completed' | 'expired';

// #endregion

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
}

interface IPieChart {
  data: number[];
  labels: string[];
  colors: string[];
}

export const Dashboard = () => {
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

  const [maintenanceChart, setMaintenanceChart] = useState<IPieChart>({
    data: [],
    labels: [],
    colors: [],
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
  });

  const [ticketsServicesTypeChart, setTicketsServicesTypeChart] = useState<IPieChart>({
    data: [],
    labels: [],
    colors: [],
  });

  // #region states
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

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [maintenanceData, setMaintenanceData] = useState<IMaintenanceData>({
    completed: [],
    expired: [],
  });

  const [timeLine, setTimeLine] = useState<ITimeline>({
    categories: [],
    series: [],
  });

  const dataFilterInitialValues: IDashboardFilter = {
    buildings: [],
    categories: [],
    responsible: [],
  };

  const [dataFilter, setDataFilter] = useState<IDashboardFilter>(dataFilterInitialValues);

  const [periodFilter, setPeriodFilter] = useState<string>('30');

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    buildings: [],
    categories: [],
    responsibles: [],
    periods: [],
  });
  // #endregion

  // #region requests
  const getAuxiliaryData = async () => {
    await Api.get('/dashboard/list-auxiliary-data')
      .then(({ data }) => {
        setFilterOptions(data);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  const getDashboardData = async (resetFilters?: boolean) => {
    setOnQuery(true);

    await Api.get('/dashboard/list-data', {
      params: {
        period: periodFilter,
        buildings: resetFilters ? JSON.stringify([]) : JSON.stringify(dataFilter.buildings),
        categories: resetFilters ? JSON.stringify([]) : JSON.stringify(dataFilter.categories),
        responsibles: resetFilters ? JSON.stringify([]) : JSON.stringify(dataFilter.responsible),
      },
    })
      .then(async ({ data }) => {
        setMaintenanceData(data.maintenancesData);
        setTimeLine(data.timeLine);
        getAuxiliaryData();
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
        setOnQuery(false);
      });
  };
  // #endregion

  // #region dashboard functions
  const findLargestValueAndIndex = (array: number[]) => {
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

  const handleSelectClick = (filterType: IFilterTypes, value: string) => {
    setDataFilter((prevState) => {
      const newState = { ...prevState };
      newState[filterType] = [...newState[filterType], value];
      return newState;
    });
  };

  const handleRemoveFilter = (filterType: IFilterTypes, index: number) => {
    setDataFilter((prevState) => {
      const newState = { ...prevState };
      newState[filterType].splice(index, 1);
      return newState;
    });
  };

  const handleResetFilter = () => {
    setDataFilter(dataFilterInitialValues);
    const resetFilters = true;
    getDashboardData(resetFilters);
  };

  const handleSelectedMaintenance = (rating: IRating, status: IRatingStatus) => {
    setSelectedRating(rating);
    setSelectedRatingStatus(status);
    setModalDashboardMaintenanceDetails(true);
  };

  const [scrollLeft, setScrollLeft] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (event: any) => {
    if (!scrollRef.current?.clientWidth) return;

    const newScrollLeft = event.target.scrollLeft + (scrollRef.current.clientWidth - 261) / 2;
    setScrollLeft(newScrollLeft);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  // #endregion

  const handleGetMaintenancesCountAndCost = async (
    maintenanceType: 'common' | 'occasional' | '',
    resetFilters?: boolean,
  ) => {
    try {
      const responseData = await getMaintenancesCountAndCost(
        periodFilter,
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

      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleGetMaintenanceInfo ~ error:', error);
      setLoading(false);
    }
  };

  const handleGetTicketsCountAndCost = async (
    ticketStatus: ITicketStatusNames | '',
    resetFilters?: boolean,
  ) => {
    try {
      const responseData = await getTicketsCountAndCost(
        periodFilter,
        dataFilter,
        ticketStatus,
        resetFilters,
      );

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

      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleGetMaintenanceInfo ~ error:', error);
      setLoading(false);
    }
  };

  const handleGetTicketsByServiceType = async (resetFilters?: boolean) => {
    try {
      const responseData = await getTicketsByServiceTypes(periodFilter, dataFilter, resetFilters);

      setTicketsServicesTypeChart(responseData);

      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleGetMaintenanceInfo ~ error:', error);
      setLoading(false);
    }
  };

  const handleGetMaintenancesByStatus = async (resetFilters?: boolean) => {
    try {
      const responseData = await getMaintenancesByStatus(periodFilter, dataFilter, resetFilters);

      setMaintenanceChart(responseData);

      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleGetMaintenanceInfo ~ error:', error);
      setLoading(false);
    }
  };

  const handleGetMaintenancesTimeline = async (resetFilters?: boolean) => {
    try {
      const responseData = await getMaintenancesTimeline(periodFilter, dataFilter, resetFilters);

      setMaintenancesTimeline(responseData);

      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleGetMaintenanceInfo ~ error:', error);
      setLoading(false);
    }
  };

  const handleGetDashboardData = async () => {
    // get count and cost from all maintenance types
    handleGetMaintenancesCountAndCost('');
    handleGetMaintenancesCountAndCost('common');
    handleGetMaintenancesCountAndCost('occasional');

    // get count and cost from all ticket status
    handleGetTicketsCountAndCost('');
    handleGetTicketsCountAndCost('open');
    handleGetTicketsCountAndCost('awaitingToFinish');
    handleGetTicketsCountAndCost('finished');
    handleGetTicketsCountAndCost('dismissed');

    // get maintenance timeline
    handleGetMaintenancesTimeline();

    // get maintenance score
    handleGetMaintenancesByStatus();

    // get ticket types
    handleGetTicketsByServiceType();
  };

  useEffect(() => {
    getAuxiliaryData();
    handleGetDashboardData();
  }, []);

  return (
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

          <Style.FilterWrapper>
            <Select
              label="Período"
              value={periodFilter}
              selectPlaceholderValue={periodFilter}
              onChange={(e) => {
                setPeriodFilter(e.target.value);
              }}
            >
              {filterOptions.periods.map((period) => (
                <option value={period.period} key={period.period}>
                  {period.label}
                </option>
              ))}
            </Select>

            <Select
              selectPlaceholderValue={dataFilter.buildings.length > 0 ? ' ' : ''}
              label="Edificação"
              value=""
              onChange={(e) => {
                handleSelectClick('buildings', e.target.value);

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
              {filterOptions.buildings.map((building) => (
                <option
                  value={building}
                  key={building}
                  disabled={dataFilter.buildings.some((e) => e === building)}
                >
                  {building}
                </option>
              ))}
            </Select>

            <Select
              selectPlaceholderValue={dataFilter.categories.length > 0 ? ' ' : ''}
              label="Categoria"
              value=""
              onChange={(e) => {
                handleSelectClick('categories', e.target.value);

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
              value=""
              onChange={(e) => {
                handleSelectClick('responsible', e.target.value);

                if (e.target.value === 'all') {
                  setDataFilter((prevState) => ({ ...prevState, responsibles: [] }));
                }
              }}
            >
              <option value="" disabled hidden>
                Selecione
              </option>

              <option value="all" disabled={dataFilter.responsible.length === 0}>
                Todos
              </option>
              {filterOptions.responsibles.map((responsible) => (
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
                type="button"
                borderless
                label="Limpar filtros"
                disable={onQuery}
                onClick={handleResetFilter}
              />
              <Button
                type="button"
                label="Filtrar"
                loading={onQuery}
                onClick={() => {
                  handleGetDashboardData();
                }}
              />
            </Style.ButtonWrapper>

            <Style.Tags>
              {dataFilter.buildings.length === 0 && (
                <ListTag padding="4px 12px" fontWeight={500} label="Todas as edificações" />
              )}

              {dataFilter.buildings.map((e, i) => (
                <ListTag
                  padding="4px 12px"
                  fontWeight={500}
                  label={e}
                  key={e}
                  onClick={() => {
                    handleRemoveFilter('buildings', i);
                  }}
                />
              ))}

              {dataFilter.categories.length === 0 && (
                <ListTag padding="4px 12px" fontWeight={500} label="Todas as categorias" />
              )}

              {dataFilter.categories.map((e, i) => (
                <ListTag
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
                <ListTag padding="4px 12px" fontWeight={500} label="Todos os responsáveis" />
              )}

              {dataFilter.responsible.map((e, i) => (
                <ListTag
                  padding="4px 12px"
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
        </Style.FilterSection>

        <Style.Wrappers>
          <Style.MaintenancesCounts>
            <Style.CountCard>
              <h5>Manutenções avulsas</h5>

              <Style.CountCardContent>
                <h2>{maintenancesData.occasionalMaintenanceData.count}</h2>
                <p className="p4">{maintenancesData.occasionalMaintenanceData.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Manutenções preventivas</h5>

              <Style.CountCardContent>
                <h2>{maintenancesData.commonMaintenanceData.count}</h2>
                <p className="p4">{maintenancesData.commonMaintenanceData.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Total de manutenções</h5>

              <Style.CountCardContent>
                <h2>{maintenancesData.totalMaintenanceData.count}</h2>
                <p className="p4">{maintenancesData.totalMaintenanceData.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>
          </Style.MaintenancesCounts>

          <Style.TicketsCounts>
            <Style.CountCard>
              <h5>Chamados abertos</h5>

              <Style.CountCardContent>
                <h2>{ticketsData.openTickets.count}</h2>
                <p className="p4">{ticketsData.openTickets.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Chamados pendentes</h5>

              <Style.CountCardContent>
                <h2>{ticketsData.awaitingToFinishTickets.count}</h2>
                <p className="p4">{ticketsData.awaitingToFinishTickets.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Chamados finalizados</h5>

              <Style.CountCardContent>
                <h2>{ticketsData.finishedTickets.count}</h2>
                <p className="p4">{ticketsData.finishedTickets.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>

            <Style.CountCard>
              <h5>Chamados indeferidos</h5>

              <Style.CountCardContent>
                <h2>{ticketsData.dismissedTickets.count}</h2>
                <p className="p4">{ticketsData.dismissedTickets.cost}</p>
              </Style.CountCardContent>
            </Style.CountCard>
          </Style.TicketsCounts>

          <Style.ChartsWrapper>
            <Style.Card>
              <h5>Linha do tempo de manutenções</h5>

              <Style.ChartContent>
                {maintenancesTimeline?.series.some((element) => element?.data.length > 0) ? (
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
                ) : (
                  <Style.NoDataWrapper>
                    <h6>Nenhuma informação encontrada</h6>
                  </Style.NoDataWrapper>
                )}
              </Style.ChartContent>
            </Style.Card>

            <Style.PieWrapper>
              <Style.Card>
                <h5>Score de manutenções</h5>
                <Style.ChartContent>
                  {maintenanceChart?.data.length > 0 ? (
                    <Chart
                      type="donut"
                      options={scoreChart.options as any}
                      series={scoreChart.series}
                      height={335}
                    />
                  ) : (
                    <Style.NoDataWrapper>
                      <h6>Nenhuma informação encontrada</h6>
                    </Style.NoDataWrapper>
                  )}
                </Style.ChartContent>
              </Style.Card>

              <Style.Card>
                <h5>Tipos de chamados</h5>

                <Style.ChartContent>
                  {ticketsServicesTypeChart?.data.length > 0 ? (
                    <Chart
                      type="donut"
                      options={ticketTypesChart.options as any}
                      series={ticketTypesChart.series}
                      height={335}
                    />
                  ) : (
                    <Style.NoDataWrapper>
                      <h6>Nenhuma informação encontrada</h6>
                    </Style.NoDataWrapper>
                  )}
                </Style.ChartContent>
              </Style.Card>
            </Style.PieWrapper>
          </Style.ChartsWrapper>

          <Style.PanelWrapper>
            <Style.Card>
              <h5>Investido em manutenções</h5>

              <Style.CardContent>
                <h2>{maintenancesData.totalMaintenanceData.cost.slice(16) || 'R$ 0,00'}</h2>
              </Style.CardContent>
            </Style.Card>

            <Style.Card>
              <h5>Manutenções mais realizadas</h5>

              <Style.CardContent>
                {maintenanceData?.completed?.map((rating) => (
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

                {maintenanceData?.completed?.length === 0 && <h6>Nenhuma informação encontrada</h6>}
              </Style.CardContent>
            </Style.Card>

            <Style.Card>
              <h5>Manutenções menos realizadas</h5>
              <Style.CardContent>
                {maintenanceData?.expired?.map((rating) => (
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
                {maintenanceData?.expired?.length === 0 && <h6>Nenhuma informação encontrada</h6>}
              </Style.CardContent>
            </Style.Card>
          </Style.PanelWrapper>
        </Style.Wrappers>
      </Style.Container>
    </>
  );
};
