import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';
import * as Style from './styles';
import { Select } from '../../components/Inputs/Select';
import { Button } from '../../components/Buttons/Button';
import { Api } from '../../services/api';
import { catchHandler } from '../../utils/functions';

export const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>();
  console.log('dashboardData:', dashboardData);

  const getDashboardData = async () => {
    await Api.get('/dashboard/list-data')
      .then(({ data }) => {
        setDashboardData(data);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
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
    series: [
      {
        name: 'Concluídas',
        data: [
          { x: '2020-08-01', y: 1 },
          { x: '2021-08-02', y: 2 },
          { x: '2022-08-03', y: 3 },
          { x: '2023-08-04', y: 4 },
          { x: '2023-08-05', y: 5 },
        ],
      },
      {
        name: 'Vencidas',
        data: [
          { x: '2020-08-01', y: 6 },
          { x: '2021-08-02', y: 7 },
          { x: '2022-08-03', y: 8 },
          { x: '2023-08-04', y: 9 },
          { x: '2023-08-05', y: 9 },
        ],
      },
    ],
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
      },
    },
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
          <Select>
            <option value="">Selecione</option>
          </Select>
          <Select>
            <option value="">Selecione</option>
          </Select>
          <Select>
            <option value="">Selecione</option>
          </Select>
          <Select>
            <option value="">Selecione</option>
          </Select>
          <Style.ButtonWrapper>
            <Button borderless label="Limpar filtros" />
            <Button label="Filtrar" />
          </Style.ButtonWrapper>
        </Style.FilterWrapper>
      </Style.FilterSection>

      <Style.Wrappers>
        <Style.ChartsWrapper>
          <Style.Card>
            <h5>Linha do tempo - Manutenções</h5>
            <Style.ChartContent>
              <Chart options={timeLineChart.options} series={timeLineChart.series} type="line" />
            </Style.ChartContent>
          </Style.Card>

          <Style.Card>
            <h5>Score</h5>
            <Style.ChartContent>
              <Chart type="donut" options={scoreChart.options} series={scoreChart.series} />
            </Style.ChartContent>
          </Style.Card>
        </Style.ChartsWrapper>

        <Style.PanelWrapper>
          <Style.Card>
            <h5>Investido em manutenções</h5>
            <Style.CardContent>
              <h1>R$ 4.200,80</h1>
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
