/* eslint-disable @typescript-eslint/no-explicit-any */
// TYPES

import { INestedObjectSortArray, ISortArray } from './types';

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

export const nestedObjectAlphabeticalOrder = ({
  category,
  isSorted,
  setIsSorted,
  toSortObject,
  toSortString,
  defaultSortedColumn = false,
}: INestedObjectSortArray) => {
  if (defaultSortedColumn) {
    if (isSorted) {
      category.Maintenances.sort((a: any, b: any) =>
        String(a[toSortObject][toSortString]).toLowerCase() <
        String(b[toSortObject][toSortString]).toLowerCase()
          ? -1
          : 1,
      );
    } else {
      category.Maintenances.sort((a: any, b: any) =>
        String(a[toSortObject][toSortString]).toLowerCase() >
        String(b[toSortObject][toSortString]).toLowerCase()
          ? -1
          : 1,
      );
    }
  } else if (isSorted) {
    category.Maintenances.sort((a: any, b: any) =>
      String(a[toSortObject][toSortString]).toLowerCase() >
      String(b[toSortObject][toSortString]).toLowerCase()
        ? -1
        : 1,
    );
  } else {
    category.Maintenances.sort((a: any, b: any) =>
      String(a[toSortObject][toSortString]).toLowerCase() <
      String(b[toSortObject][toSortString]).toLowerCase()
        ? -1
        : 1,
    );
  }

  setIsSorted(!isSorted);
};
