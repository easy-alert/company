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
      category.sort((a: any, b: any) =>
        String(a.Maintenance[toSortString]).toLowerCase() <
        String(b.Maintenance[toSortString]).toLowerCase()
          ? -1
          : 1,
      );
    } else {
      category.sort((a: any, b: any) =>
        String(a.Maintenance[toSortString]).toLowerCase() >
        String(b.Maintenance[toSortString]).toLowerCase()
          ? -1
          : 1,
      );
    }
  } else if (isSorted) {
    category.sort((a: any, b: any) =>
      String(a.Maintenance[toSortString]).toLowerCase() >
      String(b.Maintenance[toSortString]).toLowerCase()
        ? -1
        : 1,
    );
  } else {
    category.sort((a: any, b: any) =>
      String(a.Maintenance[toSortString]).toLowerCase() <
      String(b.Maintenance[toSortString]).toLowerCase()
        ? -1
        : 1,
    );
  }

  setIsSorted(!isSorted);
};

export const numericalOrder = ({ category, isSorted, setIsSorted, toSortString }: ISortArray) => {
  if (isSorted) {
    category.sort(
      (a: any, b: any) => Number(b.Maintenance[toSortString]) - Number(a.Maintenance[toSortString]),
    );
  } else {
    category.sort(
      (a: any, b: any) => Number(a.Maintenance[toSortString]) - Number(b.Maintenance[toSortString]),
    );
  }

  setIsSorted(!isSorted);
};
