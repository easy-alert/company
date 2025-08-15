export interface INotificationConfiguration {
  id: string;
  name: string;
  email: string;
  emailIsConfirmed: boolean;
  contactNumber: string;
  contactNumberIsConfirmed: boolean;
  role: string;
  isMain: boolean;
  showContact: boolean;
  nanoId: string;
}

export interface UserBuildingsPermissions {
  User: {
    id: string;
    name: string;
    email: string;
    emailIsConfirmed: boolean;
    phoneNumber: string;
    phoneNumberIsConfirmed: boolean;
    role: string;
    isMainContact: boolean;
    showContact: boolean;
  };

  isMainContact: boolean;
  showContact: boolean;
}

interface File {
  name: string;
  id: string;
  url: string;
}

interface Folder {
  name: string;
  id: string;
}

interface Folders {
  name: string;
  id: string;
  Files: File[];
  Folders: Folder[];
}

export interface IBanner {
  originalName: string;
  redirectUrl: string | null;
  url: string;
  id: string;
}

interface MaintenanceCount {
  name: string;
  pluralLabel: string;
  singularLabel: string;
  count: number;
}

export interface IBuildingDetail {
  nanoId: string;
  id: string;
  name: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  streetName: string;
  deliveryDate: string;
  warrantyExpiration: string;
  keepNotificationAfterWarrantyEnds: boolean;
  BuildingType: {
    name: string;
    id: string;
  };
  Folders: Folders;
  NotificationsConfigurations: INotificationConfiguration[];
  UserBuildingsPermissions: UserBuildingsPermissions[];
  MaintenancesCount: MaintenanceCount[];
  Banners: IBanner[];
  mandatoryReportProof: boolean;
  residentPassword: string | null;
  nextMaintenanceCreationBasis: 'executionDate' | 'notificationDate';
  isActivityLogPublic: boolean;
  guestCanCompleteMaintenance: boolean;
  BuildingApartments?: {
    id: string;
    number: string;
    floor: string;
  }[];
  image?: string;
}

export interface IRequestBuildingDetails {
  setLoading?: (setLoading: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  buildingId: string;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
  setRootFolder: React.Dispatch<React.SetStateAction<Folder>>;
}

export interface IRequestResendConfirmation {
  link: string;
  buildingNotificationConfigurationId: string;
}

export interface IChangeShowContactStatus {
  userId: string;
  buildingId: string;
  isMainContact?: boolean;
  showContact?: boolean;
}

export interface IRequestFolderDetails {
  folderId: string;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  setBreadcrumb: React.Dispatch<React.SetStateAction<Folder[]>>;
  rootFolder: Folder;
}
