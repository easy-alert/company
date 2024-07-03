import { useEffect, useState } from 'react';
import { Api } from '../services/api';
import { catchHandler } from '../utils/functions';

interface IState {
  id: number;
  sigla: string;
  nome: string;
}

export const useBrasilStates = () => {
  const [rawStates, setRawStates] = useState<IState[]>([]);

  const states = rawStates.sort((a, b) => a.nome.localeCompare(b.nome));

  const getStates = async () => {
    await Api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
      .then((res) => {
        setRawStates(res.data);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    getStates();
  }, []);

  return { states };
};
