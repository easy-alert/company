import ReactApexChart from 'react-apexcharts';

import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

import * as Style from './styles';

interface ReusableChartCardProps {
  title: string;
  type?: 'donut' | 'bar' | 'line' | 'area' | 'pie';
  chartOptions: any;
  chartSeries: number[];
  isLoading: boolean;
  height?: number;
}

export const ReusableChartCard = ({
  title,
  type = 'donut',
  chartOptions,
  chartSeries,
  isLoading,
  height = 335,
}: ReusableChartCardProps) => {
  const emptyChartSeries = chartSeries && chartSeries.every((item) => item === 0);

  if (isLoading) {
    return (
      <Style.Card>
        <DotSpinLoading />
      </Style.Card>
    );
  }

  return (
    <Style.Card>
      <h5>{title}</h5>

      {emptyChartSeries ? (
        <Style.NoDataWrapper>
          <h5>Sem dados</h5>
        </Style.NoDataWrapper>
      ) : (
        <Style.ChartContent>
          <ReactApexChart type={type} options={chartOptions} series={chartSeries} height={height} />
        </Style.ChartContent>
      )}
    </Style.Card>
  );
};
