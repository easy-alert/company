import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface ITicketServiceTypeForSelect {
  id: string;
  name: string;
  singularLabel: string;
  pluralLabel: string;
  companyId?: string | null;
}

export const useTicketServiceTypesForSelect = () => {
  const [ticketServiceTypesForSelect, setTicketServiceTypesSelect] = useState<
    ITicketServiceTypeForSelect[]
  >([]);
  const [loadingTicketServiceTypesForSelect, setLoadingTicketServiceTypesForSelect] =
    useState(false);

  const getTicketServiceTypes = useCallback(async () => {
    setLoadingTicketServiceTypesForSelect(true);

    const uri = `/list/tickets/service-types`;

    try {
      const response = await Api.get(uri);

      setTicketServiceTypesSelect(response.data.ticketServiceTypes || []);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingTicketServiceTypesForSelect(false);
    }
  }, []);

  useEffect(() => {
    getTicketServiceTypes();
  }, []);

  return {
    ticketServiceTypesForSelect,
    loadingTicketServiceTypesForSelect,
    reloadTicketServiceTypes: getTicketServiceTypes,
  };
};
