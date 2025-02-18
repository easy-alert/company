import type { IUser } from '@customTypes/IUser';
import type { IHandleModals, IMaintenance } from '../../../types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  handleSelectedMaintenance: ({
    maintenanceId,
    userResponsible,
    additionalInformation,
  }: {
    maintenanceId: string;
    userResponsible?: IUser;
    additionalInformation: string;
  }) => void;
  handleModals: ({ modal, modalState }: IHandleModals) => void;
}
