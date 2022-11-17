/* eslint-disable @typescript-eslint/no-explicit-any */
// TYPES

import { ISortArray } from './types';

export const alphabeticalOrder = ({
  category,
  isSorted,
  setIsSorted,
  toSortString,
  defaultSortedColumn = false,
}: ISortArray) => {
  if (defaultSortedColumn) {
    if (isSorted) {
      category.Maintenances.sort((a: any, b: any) =>
        String(a[toSortString]).toLowerCase() < String(b[toSortString]).toLowerCase() ? -1 : 1,
      );
    } else {
      category.Maintenances.sort((a: any, b: any) =>
        String(a[toSortString]).toLowerCase() > String(b[toSortString]).toLowerCase() ? -1 : 1,
      );
    }
  } else if (isSorted) {
    category.Maintenances.sort((a: any, b: any) =>
      String(a[toSortString]).toLowerCase() > String(b[toSortString]).toLowerCase() ? -1 : 1,
    );
  } else {
    category.Maintenances.sort((a: any, b: any) =>
      String(a[toSortString]).toLowerCase() < String(b[toSortString]).toLowerCase() ? -1 : 1,
    );
  }

  setIsSorted(!isSorted);
};
