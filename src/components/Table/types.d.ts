/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TTableCellType } from '@components/TableCell';
import type { CSSProperties } from 'styled-components';

export interface ITableHeader {
  colsHeader: {
    label: string;
    cssProps?: CSSProperties;
    cssOnMedia?: CSSProperties;
  }[];
  children: ReactElement[];
  pagination?: boolean;
  registerPerPage?: number;
  totalCountOfRegister?: number;
}

export interface ITableBody {
  colsBody: {
    cell: any;
    cssProps?: CSSProperties;
    cssOnMedia?: CSSProperties;
  }[];

  onClick?: (e: React.MouseEvent) => void;
}

export interface IColsHeader {
  label: string;
  cssProps?: CSSProperties;
}

export interface IColsBody<T> {
  cell: (item: T) => string | number | React.ReactNode;
  cssProps?: CSSProperties;
  type?: TTableCellType;
  node?: boolean;
}
