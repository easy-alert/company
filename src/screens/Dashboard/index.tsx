// #region imports
import Chart from 'react-apexcharts';
import { useEffect, useState, useRef, useCallback } from 'react';
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';
import * as Style from './styles';
import { Select } from '../../components/Inputs/Select';
import { Button } from '../../components/Buttons/Button';
import { Api } from '../../services/api';
import { catchHandler } from '../../utils/functions';
import { ListTag } from '../../components/ListTag';
import { ModalDashboardMaintenanceDetails } from './ModalDashboardMaintenanceDetails';
// #endregion

// #region interfaces
interface IDataFilter {
  buildings: string[];
  categories: string[];
  responsibles: string[];
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

type IFilterTypes = 'buildings' | 'categories' | 'responsibles';

interface ITimeline {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface IScore {
  data: number[];
  labels: string[];
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

interface IMaintenancesData {
  completed: IRating[];
  expired: IRating[];
}

type IRatingStatus = '' | 'completed' | 'expired';

interface IMaintenanceInfo {
  total: number;
  info: string;
}

interface ICounts {
  occasionalMaintenances: IMaintenanceInfo;
  commonMaintenances: IMaintenanceInfo;
  totalMaintenances: IMaintenanceInfo;
  tickets: IMaintenanceInfo;
}

// #endregion

export const Dashboard = () => {
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
  const [investments, setInvestments] = useState<string>('');

  const [maintenancesData, setMaintenancesData] = useState<IMaintenancesData>({
    completed: [],
    expired: [],
  });

  const [timeLine, setTimeLine] = useState<ITimeline>({
    categories: [],
    series: [],
  });

  const [score, setScore] = useState<IScore>({
    data: [],
    labels: [],
  });

  const [ticketTypes, setTicketTypes] = useState<IScore>({
    data: [],
    labels: [],
  });

  const [counts, setCounts] = useState<ICounts>({
    commonMaintenances: { info: '', total: 0 },
    occasionalMaintenances: { info: '', total: 0 },
    totalMaintenances: { info: '', total: 0 },
    tickets: { info: '', total: 0 },
  });

  const dataFilterInitialValues: IDataFilter = {
    buildings: [],
    categories: [],
    responsibles: [],
  };

  const [dataFilter, setDataFilter] = useState<IDataFilter>(dataFilterInitialValues);

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
        responsibles: resetFilters ? JSON.stringify([]) : JSON.stringify(dataFilter.responsibles),
      },
    })
      .then(async ({ data }) => {
        setMaintenancesData(data.maintenancesData);
        setTimeLine(data.timeLine);
        setInvestments(data.investments);
        setScore(data.score);
        setCounts(data.counts);
        setTicketTypes(data.ticketTypes);
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

  const getLabelColor = (labels: string[]) => {
    const colors: string[] = [];

    labels.forEach((label: string) => {
      switch (label) {
        case 'Concluídas':
          colors.push('#34B53A');
          break;

        case 'Vencidas':
          colors.push('#FF3508');
          break;

        case 'Pendentes':
          colors.push('#FFB200');
          break;

        default:
          break;
      }
    });

    return colors;
  };

  const timeLineChart = {
    series: timeLine.series,
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
        categories: timeLine.categories,
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
    series: score.data,
    options: {
      labels: score.labels,

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

                label: score.labels[findLargestValueAndIndex(score.data).index],
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',

                formatter(w: any) {
                  const percent =
                    (w.globals.seriesTotals[findLargestValueAndIndex(score.data).index] * 100) /
                    w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);

                  return `${percent.toFixed(1)} %`;
                },
              },
            },
          },
        },
      },

      colors: getLabelColor(score.labels),
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
    series: ticketTypes.data,
    options: {
      labels: ticketTypes.labels,

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

                label: ticketTypes.labels[findLargestValueAndIndex(ticketTypes.data).index],
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',

                formatter(w: any) {
                  const percent =
                    (w.globals.seriesTotals[findLargestValueAndIndex(ticketTypes.data).index] *
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
        offsetY: -10,
      },
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

  useEffect(() => {
    getDashboardData();
  }, []);

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
              selectPlaceholderValue={dataFilter.responsibles.length > 0 ? ' ' : ''}
              label="Responsável"
              value=""
              onChange={(e) => {
                handleSelectClick('responsibles', e.target.value);

                if (e.target.value === 'all') {
                  setDataFilter((prevState) => ({ ...prevState, responsibles: [] }));
                }
              }}
            >
              <option value="" disabled hidden>
                Selecione
              </option>

              <option value="all" disabled={dataFilter.responsibles.length === 0}>
                Todos
              </option>
              {filterOptions.responsibles.map((responsible) => (
                <option
                  value={responsible}
                  key={responsible}
                  disabled={dataFilter.responsibles.some((e) => e === responsible)}
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
                  getDashboardData();
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

              {dataFilter.responsibles.length === 0 && (
                <ListTag padding="4px 12px" fontWeight={500} label="Todos os responsáveis" />
              )}

              {dataFilter.responsibles.map((e, i) => (
                <ListTag
                  padding="4px 12px"
                  fontWeight={500}
                  label={e}
                  key={e}
                  onClick={() => {
                    handleRemoveFilter('responsibles', i);
                  }}
                />
              ))}
            </Style.Tags>
          </Style.FilterWrapper>
        </Style.FilterSection>

        <Style.Wrappers>
          <Style.Counts>
            <Style.CountCard>
              <h5>Total de avulsas</h5>
              <Style.CountCardContent>
                <h2>{counts.occasionalMaintenances.total}</h2>
                <p className="p4">{counts.occasionalMaintenances.info}</p>
              </Style.CountCardContent>
            </Style.CountCard>
            <Style.CountCard>
              <h5>Total de preventivas</h5>
              <Style.CountCardContent>
                <h2>{counts.commonMaintenances.total}</h2>
                <p className="p4">{counts.commonMaintenances.info}</p>
              </Style.CountCardContent>
            </Style.CountCard>
            <Style.CountCard>
              <h5>Total de manunteções</h5>
              <Style.CountCardContent>
                <h2>{counts.totalMaintenances.total}</h2>
                <p className="p4">{counts.totalMaintenances.info}</p>
              </Style.CountCardContent>
            </Style.CountCard>
            <Style.CountCard>
              <h5>Total de chamados</h5>
              <Style.CountCardContent>
                <h2>{counts.tickets.total}</h2>
                <p className="p4">{counts.tickets.info}</p>
              </Style.CountCardContent>
            </Style.CountCard>
          </Style.Counts>

          <Style.ChartsWrapper>
            <Style.Card>
              <h5>Linha do tempo de manutenções</h5>
              <Style.ChartContent>
                {timeLine?.series.some((element) => element?.data.length > 0) ? (
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
                        (timeLine.series[0].data.length +
                          timeLine.series[1].data.length +
                          timeLine.series[2].data.length) *
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
                  {score?.data?.some((e) => e > 0) ? (
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
                  {ticketTypes?.data?.some((e) => e > 0) ? (
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
                <h2>{investments || 'R$ 0,00'}</h2>
              </Style.CardContent>
            </Style.Card>

            <Style.Card>
              <h5>Manutenções mais realizadas</h5>
              <Style.CardContent>
                {maintenancesData?.completed?.map((rating) => (
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

                {maintenancesData?.completed?.length === 0 && (
                  <h6>Nenhuma informação encontrada</h6>
                )}
              </Style.CardContent>
            </Style.Card>

            <Style.Card>
              <h5>Manutenções menos realizadas</h5>
              <Style.CardContent>
                {maintenancesData?.expired?.map((rating) => (
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
                {maintenancesData?.expired?.length === 0 && <h6>Nenhuma informação encontrada</h6>}
              </Style.CardContent>
            </Style.Card>
          </Style.PanelWrapper>
        </Style.Wrappers>
      </Style.Container>
    </>
  );
};
