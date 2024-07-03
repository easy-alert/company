import { useState, useEffect } from 'react';
import { Api } from '../services/api';
import { catchHandler } from '../utils/functions';

interface IAuxiliaryData {
  id: string;
  label: string;
}
export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState<IAuxiliaryData[]>([]);

  const getAuxiliaryData = async () => {
    await Api.get(`/tickets/extras/auxiliary-data`)
      .then((res) => {
        setServiceTypes(res.data.types);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getAuxiliaryData();
  }, []);

  return { serviceTypes };
};
