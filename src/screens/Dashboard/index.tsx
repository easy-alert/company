// #region imports
/* eslint-disable react/no-array-index-key */
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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

interface IAxis {
  x: string;
  y: number;
}

interface ITimeline {
  name: string;
  data: IAxis[];
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

  const [timeLine, setTimeLine] = useState<ITimeline[]>([]);

  const [score, setScore] = useState<IScore>({
    data: [],
    labels: [],
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
        await getAuxiliaryData();
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
    series: timeLine || [],
    options: {
      chart: {
        defaultLocale: 'pt-BR',
        locales: [
          {
            name: 'pt-BR',
            options: {
              months: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
              ],
              shortMonths: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez',
              ],
              days: [
                'Domingo',
                'Segunda-feira',
                'Terça-feira',
                'Quarta-feira',
                'Quinta-feira',
                'Sexta-feira',
                'Sábado',
              ],
              shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
              toolbar: {
                download: 'Baixar SVG',
                selection: 'Seleção',
                selectionZoom: 'Zoom de Seleção',
                zoomIn: 'Aumentar Zoom',
                zoomOut: 'Diminuir Zoom',
                pan: 'Panorâmica',
                reset: 'Redefinir Zoom',
              },
            },
          },
        ],

        stacked: true,
        zoom: {
          type: 'x' as const,
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom' as const,
        },
      },

      grid: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },

      tooltip: {
        enabled: true,
        x: {
          show: true,
          formatter: (value: any) => format(new Date(value), 'dd/MM/yyyy'),
        },
      },

      stroke: {
        curve: 'smooth' as const,
      },

      colors: ['#34B53A', '#FF3508'],

      legend: {
        position: 'bottom' as const,
        horizontalAlign: 'center' as const,
        offsetY: 8,
      },

      xaxis: {
        type: 'datetime' as const,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
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
        enabled: false,
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
              },
              total: {
                show: true,
                showAlways: false,

                label: score.labels[findLargestValueAndIndex(score.data).index],
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',

                formatter(w: any) {
                  return w.globals.seriesTotals.reduce(
                    () => findLargestValueAndIndex(score.data).value,
                    0,
                  );
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
              label="Edificação"
              value=""
              onChange={(e) => {
                handleSelectClick('buildings', e.target.value);
              }}
            >
              <option value="" disabled hidden>
                Selecione
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
              label="Categoria"
              value=""
              onChange={(e) => {
                handleSelectClick('categories', e.target.value);
              }}
            >
              <option value="" disabled hidden>
                Selecione
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
              label="Responsável"
              value=""
              onChange={(e) => {
                handleSelectClick('responsibles', e.target.value);
              }}
            >
              <option value="" disabled hidden>
                Selecione
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
          <Style.ChartsWrapper>
            <Style.Card>
              <h5>Linha do tempo - Manutenções</h5>
              <Style.ChartContent>
                {timeLine?.some((element) => element?.data.length > 0) ? (
                  <Chart
                    options={timeLineChart.options}
                    series={timeLineChart.series}
                    type="line"
                    height={280}
                  />
                ) : (
                  <Style.NoDataWrapper>
                    <h6>Nenhuma informação encontrada</h6>
                  </Style.NoDataWrapper>
                )}
              </Style.ChartContent>
            </Style.Card>

            <Style.Card>
              <h5>Score - Manutenções</h5>

              <Style.ChartContent>
                {score?.data?.length > 0 ? (
                  <Chart
                    type="donut"
                    options={scoreChart.options}
                    series={scoreChart.series}
                    height={330}
                  />
                ) : (
                  <Style.NoDataWrapper>
                    <h6>Nenhuma informação encontrada</h6>
                  </Style.NoDataWrapper>
                )}
              </Style.ChartContent>
            </Style.Card>
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
                      {rating.data.period > 1
                        ? `${rating.data.period} ${rating.data.PeriodTimeInterval.pluralLabel}`
                        : `${rating.data.period} ${rating.data.PeriodTimeInterval.singularLabel}`}
                    </p>
                  </Style.MostAccomplishedMaintenance>
                ))}

                {maintenancesData?.completed?.length === 0 && (
                  <h6>Nenhuma informação encontrada.</h6>
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
                      {rating.data.period > 1
                        ? `${rating.data.period} ${rating.data.PeriodTimeInterval.pluralLabel}`
                        : `${rating.data.period} ${rating.data.PeriodTimeInterval.singularLabel}`}
                    </p>
                  </Style.LeastAccomplishedMaintenance>
                ))}
                {maintenancesData?.expired?.length === 0 && <h6>Nenhuma informação encontrada.</h6>}
              </Style.CardContent>
            </Style.Card>
          </Style.PanelWrapper>
        </Style.Wrappers>
      </Style.Container>
    </>
  );
};
