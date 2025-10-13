import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface ITicketPlaceForSelect {
  id: string;
  label: string;
  companyId?: string | null;
}

export const useTicketPlacesForSelect = () => {
  const [ticketPlacesForSelect, setTicketPlacesSelect] = useState<ITicketPlaceForSelect[]>([]);
  const [loadingTicketPlacesForSelect, setLoadingTicketPlacesForSelect] = useState(false);

  const getTicketPlaces = useCallback(async () => {
    setLoadingTicketPlacesForSelect(true);

    const uri = `/list/tickets/places`;

    try {
      const response = await Api.get(uri);

      setTicketPlacesSelect(response.data.ticketPlaces || []);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingTicketPlacesForSelect(false);
    }
  }, []);

  useEffect(() => {
    getTicketPlaces();
  }, []);

  return { ticketPlacesForSelect, loadingTicketPlacesForSelect, reloadTicketPlaces: getTicketPlaces };
};
