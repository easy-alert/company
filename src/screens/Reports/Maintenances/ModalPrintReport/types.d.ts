import { IFilterforRequest } from '../types';

export interface IModalPrintQRCode {
  setModal: (setModal: boolean) => void;
  filters: IFilterforRequest;
}
