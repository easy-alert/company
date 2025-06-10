import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { PopoverComponent } from '@components/Popover';

import * as Style from './styles';

interface ReusableChartCardProps {
  title: string;
  type?: 'donut' | 'bar' | 'line' | 'area' | 'pie';
  chartOptions: any;
  chartSeries: number[];
  isLoading: boolean;
  height?: number;
  activitiesByLabel?: Record<string, any[]>;
  onMaintenanceClick?: (maintenanceId: string) => void;
  typePopover?: 'maintenance' | 'ticket';
}

export const ReusableChartCard = ({
  title,
  type = 'donut',
  chartOptions,
  chartSeries,
  isLoading,
  height = 335,
  activitiesByLabel = {},
  typePopover = 'maintenance',
  onMaintenanceClick,
}: ReusableChartCardProps) => {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const emptyChartSeries = chartSeries && chartSeries.every((item) => item === 0);

  if (isLoading) {
    return (
      <Style.Card>
        <DotSpinLoading />
      </Style.Card>
    );
  }

  const currentLabel =
    hoveredIndex !== null && chartOptions.labels ? chartOptions.labels[hoveredIndex] : null;

  function normalize(str: string) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  const currentActivities = currentLabel
    ? Object.entries(activitiesByLabel).find(
        ([label]) => normalize(label) === normalize(currentLabel),
      )?.[1] || []
    : [];

  const labelIndex =
    currentLabel && chartOptions.labels
      ? chartOptions.labels.findIndex((l: string) => l.toLowerCase() === currentLabel.toLowerCase())
      : -1;

  const barColor =
    labelIndex !== -1 && chartOptions.colors ? chartOptions.colors[labelIndex] : '#FFB200';

  return (
    <Style.Card>
      <h5>{title}</h5>
      {emptyChartSeries ? (
        <Style.NoDataWrapper>
          <h5>Sem dados</h5>
        </Style.NoDataWrapper>
      ) : (
        <Style.ChartContent>
          <PopoverComponent
            label={`${currentLabel || ''} (${currentActivities.length})`}
            open={open}
            chartColors={chartOptions.colors}
            chartLabels={chartOptions.labels}
            buttonChildren={
              <ReactApexChart
                type={type}
                options={{
                  ...chartOptions,
                  chart: {
                    ...chartOptions.chart,
                    events: {
                      dataPointSelection: (_event: any, _chartContext: any, config: any) => {
                        if (hoveredIndex === config.dataPointIndex && open) {
                          setHoveredIndex(null);
                          setOpen(false);
                        } else {
                          setHoveredIndex(config.dataPointIndex);
                          setOpen(true);
                        }
                      },
                    },
                  },
                }}
                series={chartSeries}
                height={height}
              />
            }
            contentChildren={
              currentActivities.length > 0 ? (
                <Style.PopoverList>
                  {currentActivities.map((item) =>
                    typePopover === 'ticket' ? (
                      <Style.PopoverListItem
                        key={item.id || item.ticketNumber}
                        $barcolor={barColor}
                        onClick={() => onMaintenanceClick && onMaintenanceClick(item.id)}
                      >
                        <div>
                          <strong>#{item.ticketNumber}</strong> -{' '}
                          <strong>
                            {item.buildingName || (item.building && item.building.name) || '-'}
                          </strong>
                        </div>
                        <div className="popover-desc">{item.description || '-'}</div>
                      </Style.PopoverListItem>
                    ) : (
                      <Style.PopoverListItem
                        key={item.id || `${item.category}-${item.activity}`}
                        $barcolor={barColor}
                        onClick={() => onMaintenanceClick && onMaintenanceClick(item.id)}
                      >
                        <div className="popover-header">
                          <strong>{item.buildingName || '-'}</strong>
                          {item.element && <span> - {item.element}</span>}
                        </div>
                        <div className="popover-title">{item.activity || '-'}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {item.priorityLabel && (
                            <span>
                              Prioridade:{' '}
                              <span style={{ color: item.priorityBackgroundColor }}>
                                {item.priorityLabel}
                              </span>
                              {' | '}
                            </span>
                          )}
                          {item.dueDate && (
                            <span>Vencimento: {new Date(item.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        {item.description && <div className="popover-desc">{item.description}</div>}
                      </Style.PopoverListItem>
                    ),
                  )}
                </Style.PopoverList>
              ) : (
                <Style.NoActivities>Sem atividades</Style.NoActivities>
              )
            }
            position={['right', 'bottom']}
          />
        </Style.ChartContent>
      )}
    </Style.Card>
  );
};
