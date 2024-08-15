import { useState, useEffect } from 'react';
import { Api } from '../services/api';
import { catchHandler } from '../utils/functions';

interface IAuxiliaryData {
  id: string;
  label: string;
}
export const useAreaOfActivities = ({ findAll }: { findAll: boolean }) => {
  const [areaOfActivities, setAreaOfActivities] = useState<IAuxiliaryData[]>([]);

  const getAuxiliaryData = async () => {
    await Api.get(`/suppliers/extras/area-of-activities?findAll=${findAll}`)
      .then((res) => {
        setAreaOfActivities(res.data.areaOfActivities);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getAuxiliaryData();
  }, []);

  return { areaOfActivities, getAuxiliaryData };
};
