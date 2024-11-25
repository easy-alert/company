import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IUseServiceTypes {
  buildingNanoId?: string;
  page?: number;
  take?: number;
}
interface IServiceTypes {
  id: string;
  name?: string;
  label?: string;
  singularLabel?: string;
  pluralLabel?: string;
  color?: string;
  backgroundColor?: string;
}

export const useServiceTypes = ({ buildingNanoId, page, take }: IUseServiceTypes) => {
  const [serviceTypes, setServiceTypes] = useState<IServiceTypes[]>([]);

  const getServiceTypes = useCallback(async () => {
    const uri = `/serviceTypes?buildingNanoId=${buildingNanoId}&page=${page}&take=${take}`;

    const params = {
      buildingNanoId,
      page,
      take,
    };

    try {
      const response = await Api.get(uri, { params });

      setServiceTypes(response.data);
    } catch (error: any) {
      handleToastify(error);
    }
  }, [buildingNanoId, page, take]);

  useEffect(() => {
    getServiceTypes();
  }, [buildingNanoId, page, take]);

  return { serviceTypes };
};
