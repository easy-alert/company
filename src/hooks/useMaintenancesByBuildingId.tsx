import { useState, useEffect } from 'react';
import { Api } from '../services/api';
import { catchHandler } from '../utils/functions';
import { IBuildingMaintenances } from '../types/IBuildingMaintenances';

export const useMaintenancesByBuildingId = ({ buildingId }: { buildingId: string }) => {
  const [buildingName, setBuildingName] = useState<string>('');
  const [buildingMaintenances, setBuildingMaintenances] = useState<IBuildingMaintenances[]>([]);

  const getMaintenancesByBuildingId = async () => {
    await Api.get(`/buildings/list/details/${buildingId}/maintenances`)
      .then((res) => {
        setBuildingName(res.data.buildingName);
        setBuildingMaintenances(res.data.BuildingMaintenances);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getMaintenancesByBuildingId();
  }, []);

  return { buildingName, buildingMaintenances, getMaintenancesByBuildingId };
};
