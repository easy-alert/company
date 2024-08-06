import { CSSProperties } from 'styled-components';

export interface IColorfulTableHeader {
  colsHeader: {
    label: any;
    cssProps?: CSSProperties;
    cssOnMedia?: CSSProperties;
  }[];
  children: React.ReactNode[] | React.ReactNode;
  cssProps?: CSSProperties;
}

export interface IColorfulTableBody {
  colsBody: {
    cell: any;
    cssProps?: CSSProperties;
    cssOnMedia?: CSSProperties;
  }[];
  bgColor?: string;
}
