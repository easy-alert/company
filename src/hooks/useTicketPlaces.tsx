import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface ITicketPlace {
  id: string;
  label: string;
}

export const useTicketPlaces = ({ placeId }: { placeId?: string }) => {
  const [ticketPlaces, setTicketPlaces] = useState<ITicketPlace[]>([]);

  const getTicketPlaces = useCallback(async () => {
    const uri = `/tickets/places/${placeId}`;

    try {
      const response = await Api.get(uri);

      setTicketPlaces(response.data);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage.message);
    }
  }, []);

  useEffect(() => {
    getTicketPlaces();
  }, []);

  return { ticketPlaces };
};
