import { IMaintenance } from '../../../types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  handleSelectedMaintenance: ({
    maintenanceId,
    additionalInformation,
  }: {
    maintenanceId: string;
    additionalInformation: string;
  }) => void;
  handleModalAdditionalInformation: (modalState: boolean) => void;
}
