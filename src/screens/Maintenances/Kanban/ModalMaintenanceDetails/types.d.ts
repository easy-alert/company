import type { TModalNames } from '..';
import type { IModalAdditionalInformations } from '../types';

export interface IModalMaintenanceDetails {
  modalAdditionalInformations: IModalAdditionalInformations;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleQuery: (queryState) => void;
}
