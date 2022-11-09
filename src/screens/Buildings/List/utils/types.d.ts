export interface IBuildingList {
  name: string;
  city: string;
  neighborhood: string;
  id: string;
}

export interface IRequestBuildingList {
  setBuildingList: (setCompanies: ICompany[]) => void;
  setLoading?: (setLoading: boolean) => void;
  setPage?: (setPage: number) => void;
  setCount: (setCount: number) => void;
  page: number;
  filter?: string;
}
