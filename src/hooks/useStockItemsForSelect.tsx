import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IStockItemForSelect {
  id: string;
  name: string;
}

export const useStockItemsForSelect = ({ buildingId }: { buildingId?: string }) => {
  const [stockItemsForSelect, setStockItemsForSelect] = useState<IStockItemForSelect[]>([]);
  const [loadingStockItemsForSelect, setLoadingStockItemsForSelect] = useState(false);

  const getStockItemsForSelect = useCallback(async () => {
    setLoadingStockItemsForSelect(true);

    const uri = `/list/stock/items`;

    const params = {
      buildingId,
    };

    try {
      const response = await Api.get(uri, { params });

      setStockItemsForSelect(response.data.stockItems);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingStockItemsForSelect(false);
    }
  }, [buildingId]);

  useEffect(() => {
    getStockItemsForSelect();
  }, [buildingId]);

  return { stockItemsForSelect, loadingStockItemsForSelect };
};
