import { useEffect, useState } from 'react';
import { catchHandler } from '../utils/functions';
import { Api } from '../services/api';

interface ICity {
  id: number;
  nome: string;
}

export const useBrasilCities = ({ UF }: { UF: string }) => {
  const [rawCities, setRawCities] = useState<ICity[]>([]);

  const cities = rawCities.sort((a, b) => a.nome.localeCompare(b.nome));

  const getCities = async () => {
    await Api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`)
      .then((res) => {
        setRawCities(res.data);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getCities();
  }, [UF]);

  return { cities };
};
