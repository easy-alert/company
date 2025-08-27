import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IStockItemTypeForSelect {
  id: string;
  name: string;
}

export const useStockItemTypesForSelect = ({ buildingId }: { buildingId?: string }) => {
  const [stockItemTypesForSelect, setStockItemTypesForSelect] = useState<IStockItemTypeForSelect[]>(
    [],
  );
  const [loadingStockItemTypesForSelect, setLoadingStockItemTypesForSelect] = useState(false);

  const getStockItemTypesForSelect = useCallback(async () => {
    setLoadingStockItemTypesForSelect(true);

    const uri = `/list/stock/item-types`;

    const params = {
      buildingId,
    };

    try {
      const response = await Api.get(uri, { params });

      setStockItemTypesForSelect(response.data.stockItemTypes);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingStockItemTypesForSelect(false);
    }
  }, [buildingId]);

  useEffect(() => {
    getStockItemTypesForSelect();
  }, [buildingId]);

  return { stockItemTypesForSelect, loadingStockItemTypesForSelect };
};
