import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IUser } from '@customTypes/IUser';

interface IUseUsersForSelect {
  buildingId?: string;
  checkPerms?: boolean;
}

export const useUsersForSelect = ({ buildingId, checkPerms = false }: IUseUsersForSelect) => {
  const [usersForSelect, setUsersForSelect] = useState<IUser[]>([]);
  const [loadingUsersForSelect, setLoadingUsersForSelect] = useState<boolean>(true);

  const getUsersForSelect = useCallback(async () => {
    setLoadingUsersForSelect(true);

    const uri = `/list/users`;

    const params = {
      buildingId,
      checkPerms,
    };

    try {
      const response = await Api.get(uri, { params });

      setUsersForSelect(response.data.users);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingUsersForSelect(false);
    }
  }, [buildingId, checkPerms]);

  useEffect(() => {
    getUsersForSelect();
  }, [buildingId, getUsersForSelect]);

  return { usersForSelect, loadingUsersForSelect };
};
