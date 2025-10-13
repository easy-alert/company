import type { IBuildingType } from './IBuildingType';

export interface IBuilding {
  id?: string;

  buildingTypeId?: string;
  companyId?: string;
  nanoId?: string;

  name?: string;
  cep?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  streetName?: string;
  area?: string;
  image?: string;
  deliveryDate?: string;
  warrantyExpiration?: string;
  keepNotificationAfterWarrantyEnds?: boolean;
  mandatoryReportProof?: boolean;
  isActivityLogPublic?: boolean;
  guestCanCompleteMaintenance?: boolean;
  showAllTicketsToResident?: boolean;
  ticketAnnexRequired?: boolean;

  residentPassword?: string;

  nextMaintenanceCreationBasis?: string;

  createdAt?: string;
  updatedAt?: string;

  BuildingType?: IBuildingType;
  // Company?: ICompany;
  // NotificationsConfigurations?: IBuildingNotificationConfiguration[];
  // Categories?: IBuildingCategory[];
  // Annexes?: IBuildingAnnexes[];
  // Banners?: IBuildingBanners[];
  // MaintenancesHistory?: IMaintenanceHistory[];
  // oldBuildingIds?: IOldBuildingIds[];
  // BuildingFolders?: IBuildingFolders[];
  // BuildingsAccessHistory?: IBuildingAccessHistory[];
  // checklists?: IChecklist[];
  // tickets?: ITicket[];
}
