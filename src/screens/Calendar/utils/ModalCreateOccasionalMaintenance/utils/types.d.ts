interface IAnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
}

interface ICategories {
  id: string;
  name: string;
  Maintenances: {
    id: string;
    element: string;
    activity: string;
    responsible: string;
  }[];
}

export interface IAuxiliaryData {
  Buildings: {
    id: string;
    name: string;
  }[];
  Categories: ICategories[];
}

export interface ICreateOccasionalMaintenanceData {
  buildingId: string;
  executionDate: string;

  inProgress: boolean;

  maintenanceData: {
    element: string;
    activity: string;
    responsible: string;
  };

  categoryData: {
    id: string;
    name: string;
  };

  reportData: {
    cost: string;
    observation: string;
    files: IAnnexesAndImages[];
    images: IAnnexesAndImages[];
  };
}

export interface IRequestAuxiliaryDataForCreateOccasionalMaintenance {
  setLoading: (setOnQuery: boolean) => void;
  setAuxiliaryData: React.Dispatch<React.SetStateAction<IAuxiliaryData>>;
}

export interface IRequestCreateOccasionalMaintenance {
  setModal: (setModal: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  data: ICreateOccasionalMaintenanceData;
  origin: string;
  getCalendarData: () => Promise<void>;
}

export interface IModalCreateOccasionalMaintenance {
  setModal: (setModal: boolean) => void;
  getCalendarData: () => Promise<void>;
  checklistTitle?: string;
  checklistBuildingId?: string;
}

export interface IModalCreateOccasionalMaintenanceInstructions {
  setView: React.Dispatch<React.SetStateAction<number>>;
  setModal: (setModal: boolean) => void;
}

export interface AnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
}
