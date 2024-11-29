import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IBuilding } from '@customTypes/IBuilding';

export const useBuildings = ({ filter = '', page = 1 }: { filter?: string; page?: number }) => {
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [buildingCount, setBuildingCount] = useState<number>(0);

  const getBuildings = useCallback(async () => {
    const uri = `/buildings/list`;

    const params = {
      search: filter,
      page,
    };

    try {
      const response = await Api.get(uri, { params });

      setBuildings(response.data.Buildings);
      setBuildingCount(response.data.buildingsCount);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage.message);
    }
  }, []);

  useEffect(() => {
    getBuildings();
  }, []);

  return { buildings, buildingCount };
};
