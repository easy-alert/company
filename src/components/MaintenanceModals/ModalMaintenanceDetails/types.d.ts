import type { TModalNames } from '@customTypes/TModalNames';

export interface IModalAdditionalInformations {
  id: string;
  expectedNotificationDate: string;
  expectedDueDate: string;
  isFuture: boolean;
}

export interface IModalMaintenanceDetails {
  modalAdditionalInformations: IModalAdditionalInformations;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleQuery?: (queryState) => void;
  handleRefresh: () => void;
}
