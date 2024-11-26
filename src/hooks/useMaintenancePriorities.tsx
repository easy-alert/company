import { useState, useEffect, useCallback } from 'react';

import { getPriority } from '@services/apis/getPriority';

import { handleToastify } from '@utils/toastifyResponses';

import type { IPriority } from '@customTypes/IPriority';

export const useMaintenancePriorities = () => {
  const [maintenancePriorities, setMaintenancePriorities] = useState<IPriority[]>([]);

  const handleGetPriorities = useCallback(async () => {
    try {
      const responseData = await getPriority();

      setMaintenancePriorities(responseData);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage.message);
    }
  }, []);

  useEffect(() => {
    handleGetPriorities();
  }, []);

  return { maintenancePriorities };
};
