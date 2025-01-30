import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IBuildingForSelect } from '@customTypes/IBuildingForSelect';

interface IUserBuildingsForSelect {
  checkPerms?: boolean;
}

export const useBuildingsForSelect = ({ checkPerms = false }: IUserBuildingsForSelect) => {
  const [buildingsForSelect, setBuildingsForSelect] = useState<IBuildingForSelect[]>([]);
  const [loadingBuildingsForSelect, setLoadingBuildingsForSelect] = useState<boolean>(true);

  const getBuildingsForSelect = useCallback(async () => {
    setLoadingBuildingsForSelect(true);

    const uri = `/list/buildings`;

    const params = {
      checkPerms,
    };

    try {
      const response = await Api.get(uri, { params });

      setBuildingsForSelect(response.data.buildings);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage.message);
    } finally {
      setLoadingBuildingsForSelect(false);
    }
  }, [checkPerms]);

  useEffect(() => {
    getBuildingsForSelect();
  }, [getBuildingsForSelect]);

  return { buildingsForSelect, loadingBuildingsForSelect };
};
