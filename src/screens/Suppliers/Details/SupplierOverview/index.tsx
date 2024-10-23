// UTILS
import { applyMask } from '@utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { ISupplierOverview } from './types';

export const SupplierOverview = ({ maintenancesHistory }: ISupplierOverview) => {
  const preventiveMaintenances = maintenancesHistory.filter(
    (maintenance) => maintenance.type === 'common',
  );
  const preventiveMaintenancesCost = applyMask({
    mask: 'BRL',
    value: String(
      preventiveMaintenances.reduce((acc, maintenance) => acc + (maintenance.cost ?? 0), 0),
    ),
  });

  const occasionalMaintenances = maintenancesHistory.filter(
    (maintenance) => maintenance.type === 'occasional',
  );
  const occasionalMaintenancesCost = applyMask({
    mask: 'BRL',
    value: String(
      occasionalMaintenances.reduce((acc, maintenance) => acc + (maintenance.cost ?? 0), 0),
    ),
  });

  const totalCost = applyMask({
    mask: 'BRL',
    value: String(
      maintenancesHistory.reduce((acc, maintenance) => acc + (maintenance.cost ?? 0), 0),
    ),
  });

  return (
    <Style.OverviewContainer>
      <h2>Visão Geral</h2>

      <Style.OverviewCardContainer>
        <Style.OverviewCard>
          <h5>Total de avulsas</h5>

          <Style.OverviewCardContent>
            <h2>{occasionalMaintenances.length}</h2>
            <p>Valor investido: {occasionalMaintenancesCost.value}</p>
          </Style.OverviewCardContent>
        </Style.OverviewCard>

        <Style.OverviewCard>
          <h5>Total de preventivas</h5>

          <Style.OverviewCardContent>
            <h2>{preventiveMaintenances.length}</h2>
            <p>Valor investido: {preventiveMaintenancesCost.value}</p>
          </Style.OverviewCardContent>
        </Style.OverviewCard>

        <Style.OverviewCard>
          <h5>Total de manutenções</h5>

          <Style.OverviewCardContent>
            <h2>{maintenancesHistory.length}</h2>
            <p>Valor investido: {totalCost.value}</p>
          </Style.OverviewCardContent>
        </Style.OverviewCard>
      </Style.OverviewCardContainer>
    </Style.OverviewContainer>
  );
};
