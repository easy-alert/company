import { NiboApi } from '@services/niboApi';
import type { IResponse } from '@customTypes/IResponse';
import type { IReceipt } from '@customTypes/nibo/IReceipt';

interface IGetNiboReceipts {
  filter: string;
  orderBy?: string;
  top?: string;
  skip?: string;
}

interface IGetNiboReceiptsResponse extends IResponse {
  data: {
    items: IReceipt[];
    count: number;
  };
}

export const getNiboReceipts = async ({ filter, orderBy, top, skip }: IGetNiboReceipts) => {
  const uri = '/nfse';

  const params = {
    $filter: filter,
    $orderBy: orderBy,
    $top: top,
    $skip: skip,
  };

  try {
    const response: IGetNiboReceiptsResponse = await NiboApi.get(uri, { params });

    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
