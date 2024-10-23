import { IMaintenance } from './IMaintenance';

export interface IBuildingMaintenances {
  Category: {
    id: string;
    name: string;
  };
  Maintenances: IMaintenance[];
  Building: {
    name: string;
    nanoId: string;
  };
}
