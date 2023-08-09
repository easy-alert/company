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

export const Dashboard = () => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [investments, setInvestments] = useState<boolean>(true);
  const [timeLine, setTimeLine] = useState<any>();

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
        setTimeLine(data.timeLine);
        setInvestments(data.investments);
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
    series: timeLine,
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

  const temp = {
    data: [20, 15, 10],
    labels: ['Concluídas', 'Vencidas', 'Pendentes'],
  };

  const scoreChart = {
    series: temp.data,
    options: {
      labels: temp.labels,

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
              },
              total: {
                show: true,
                showAlways: false,
                // label:
                //   knowledgeCountByTypeChart?.knowledgeTypes[
                //     findLargestValueAndIndex(knowledgeCountByTypeChart?.data).index
                //   ],
                label: temp.labels[findLargestValueAndIndex(temp.data).index],
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                // formatter(w: any) {
                //   return w.globals.seriesTotals.reduce(
                //     () => findLargestValueAndIndex(knowledgeCountByTypeChart?.data).value,
                //     0,
                //   );
                // },
                formatter(w: any) {
                  return w.globals.seriesTotals.reduce(
                    () => findLargestValueAndIndex(temp.data).value,
                    0,
                  );
                },
              },
            },
          },
        },
      },
      // colors: getLabelColorBasedOnKnowledgeType(knowledgeCountByTypeChart.knowledgeTypes),
      colors: getLabelColor(temp.labels),
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

  useEffect(() => {
    getDashboardData();
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
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
          {[...dataFilter.buildings, ...dataFilter.categories, ...dataFilter.responsibles].length >
            0 && (
            <Style.Tags>
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
            </Style.Tags>
          )}
        </Style.FilterWrapper>
      </Style.FilterSection>

      <Style.Wrappers>
        <Style.ChartsWrapper>
          <Style.Card>
            <h5>Linha do tempo - Manutenções</h5>
            <Style.ChartContent>
              <Chart
                options={timeLineChart.options}
                series={timeLineChart.series}
                type="line"
                height={280}
              />
            </Style.ChartContent>
          </Style.Card>

          <Style.Card>
            <h5>Score</h5>
            <Style.ChartContent>
              <Chart
                type="donut"
                options={scoreChart.options}
                series={scoreChart.series}
                height={330}
              />
            </Style.ChartContent>
          </Style.Card>
        </Style.ChartsWrapper>

        <Style.PanelWrapper>
          <Style.Card>
            <h5>Investido em manutenções</h5>
            <Style.CardContent>
              <h1>{investments}</h1>
            </Style.CardContent>
          </Style.Card>

          <Style.Card>
            <h5>Manutenções mais realizadas</h5>
            <Style.CardContent>
              <Style.MostAccomplishedMaintenance>
                <h6>man man man man man man man man man man man man man man man man </h6>
                <p className="p2">
                  claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa
                  claaa claaa claaa
                </p>
                <p className="p3">A cada 9999 semanas</p>
              </Style.MostAccomplishedMaintenance>
              <Style.MostAccomplishedMaintenance>
                <h6>man man man man man man man man man man man man man man man man </h6>
                <p className="p2 ">
                  claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa
                  claaa claaa claaa
                </p>
                <p className="p3">A cada 9999 semanas</p>
              </Style.MostAccomplishedMaintenance>
            </Style.CardContent>
          </Style.Card>

          <Style.Card>
            <h5>Manutenções menos realizadas</h5>
            <Style.CardContent>
              <Style.LeastAccomplishedMaintenance>
                <h6>man man man man man man man man man man man man man man man man </h6>
                <p className="p2">
                  claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa
                  claaa claaa claaa
                </p>
                <p className="p3">A cada 9999 semanas</p>
              </Style.LeastAccomplishedMaintenance>
              <Style.LeastAccomplishedMaintenance>
                <h6>man man man man man man man man man man man man man man man man </h6>
                <p className="p2">
                  claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa claaa
                  claaa claaa claaa
                </p>
                <p className="p3">A cada 9999 semanas</p>
              </Style.LeastAccomplishedMaintenance>
            </Style.CardContent>
          </Style.Card>
        </Style.PanelWrapper>
      </Style.Wrappers>
    </Style.Container>
  );
};
