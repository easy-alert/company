import type { IMaintenance } from '@customTypes/IMaintenance';

export interface IModalEditMaintenanceHistory {
  userId?: string;
  maintenance: IMaintenance;
  handleEditModal: (modalState: boolean) => void;
  handleRefresh?: () => void;
}
