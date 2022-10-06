import { ICompany, IFormDataCompany } from '../../../../../List/utils/types';

export interface IModalCreateCompanyAndOwner {
  setCount: (setCount: number) => void;
  page: number;
  setCompanies: (setCompanies: ICompany[]) => void;
  setModal: (setModal: boolean) => void;
}

export interface IRequestCreateCompanyAndOWner {
  setCount: (setCount: number) => void;
  page: number;
  setCompanies: (setCompanies: ICompany[]) => void;
  setModal: (setModal: boolean) => void;
  data: IFormDataCompany;
  setOnQuery: (setOnQuery: boolean) => void;
}
