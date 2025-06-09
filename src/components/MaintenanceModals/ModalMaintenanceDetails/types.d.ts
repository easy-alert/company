import type { TModalNames } from '..';
import type { IModalAdditionalInformations } from '../types';

export interface IModalMaintenanceDetails {
  modalAdditionalInformations: IModalAdditionalInformations;
  userId: string;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleQuery: (queryState) => void;
  handleRefresh: () => void;
}
