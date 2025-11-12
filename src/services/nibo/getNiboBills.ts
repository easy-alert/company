import { NiboApi } from '@services/niboApi';
import type { IResponse } from '@customTypes/IResponse';
import type { IBill } from '@customTypes/nibo/IBill';

interface IGetNiboBills {
  filter: string;
  orderBy?: string;
  top?: string;
  skip?: string;
}

interface IGetNiboBillsResponse extends IResponse {
  data: {
    items: IBill[];
    count: number;
  };
}

export const getNiboBills = async ({ filter, orderBy, top, skip }: IGetNiboBills) => {
  const uri = '/public/collections';

  const params = {
    $filter: filter,
    $orderBy: orderBy,
    $top: top,
    $skip: skip,
  };

  try {
    const response: IGetNiboBillsResponse = await NiboApi.get(uri, { params });

    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

