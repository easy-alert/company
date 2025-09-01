import { useState, useEffect, useCallback } from 'react';

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IStockTransfers {
  id: string;

  building: {
    id: string;
    name: string;
  };

  stockItem: {
    id: string;
    name: string;
  };
}

export const useStockTransfersForSelect = ({
  stockItemId,
  enabled = true,
}: {
  stockItemId: string;
  enabled: boolean;
}) => {
  const [stockTransfersForSelect, setStockTransfersForSelect] = useState<IStockTransfers[]>([]);
  const [loadingStockTransfersForSelect, setLoadingStockTransfersForSelect] = useState(false);

  const getStockTransfersForSelect = useCallback(async () => {
    if (!stockItemId || !enabled) return;

    setLoadingStockTransfersForSelect(true);

    const uri = 'list/stock/transfers';

    const params = {
      stockItemId,
    };

    try {
      const response = await Api.get(uri, { params });

      setStockTransfersForSelect(response.data.stockTransfers);
    } catch (error: any) {
      handleToastify(error.response);
    } finally {
      setLoadingStockTransfersForSelect(false);
    }
  }, [stockItemId, enabled]);

  useEffect(() => {
    getStockTransfersForSelect();
  }, [stockItemId, enabled]);

  return { stockTransfersForSelect, loadingStockTransfersForSelect };
};
