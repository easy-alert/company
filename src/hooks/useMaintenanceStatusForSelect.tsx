import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IMaintenanceStatus } from '@customTypes/IMaintenanceStatus';

export const useMaintenanceStatusForSelect = () => {
  const [maintenanceStatusForSelect, setMaintenanceStatusForSelect] = useState<
    IMaintenanceStatus[]
  >([]);
  const [loadingMaintenanceStatusForSelect, setLoadingMaintenanceStatusForSelect] =
    useState<boolean>(true);

  const getMaintenanceStatusSelect = useCallback(async () => {
    setLoadingMaintenanceStatusForSelect(true);

    const uri = `/list/maintenances/status`;

    try {
      const response = await Api.get(uri);

      setMaintenanceStatusForSelect(response.data.maintenanceStatus);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingMaintenanceStatusForSelect(false);
    }
  }, []);

  useEffect(() => {
    getMaintenanceStatusSelect();
  }, [getMaintenanceStatusSelect]);

  return {
    maintenanceStatusForSelect,
    loadingMaintenanceStatusForSelect,
  };
};
