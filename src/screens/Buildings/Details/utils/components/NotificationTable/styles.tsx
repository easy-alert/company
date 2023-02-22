/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Background = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRowHead = styled.tr<{ bgColor?: string }>``;

export const TableRow = styled.tr<{ bgColor?: string }>`
  ${({ bgColor }) => bgColor && `background-color: ${theme.color.white};`};
`;

export const TableColHeader = styled.th<{ cssProps: any; cssOnMedia: any }>`
  color: ${theme.color.black};
  text-align: start;
  background-color: ${theme.color.gray0};
  border: 1px solid ${theme.color.gray3};
  font-size: 12px;
  line-height: 14px;

  :first-child {
    border-top-left-radius: ${theme.size.xxsm};
  }

  :last-child {
    border-top-right-radius: ${theme.size.xxsm};
  }

  :not(:first-child) {
    border-left: none;
  }

  :not(:last-child) {
    border-right: none;
  }

  ${({ cssProps }) => cssProps}

  padding: ${theme.size.xsm} ${theme.size.sm};

  @media (max-width: 900px) {
    ${({ cssOnMedia }) => cssOnMedia}
  }
`;

export const TableColBody = styled.td<{
  textAlign?: string;
  cssProps: any;
  cssOnMedia: any;
}>`
  height: ${theme.size.lg};
  text-align: start;
  padding: ${theme.size.xsm} ${theme.size.sm};
  white-space: nowrap;
  // COLOCAR ELLIPSIS
  border: 1px solid ${theme.color.gray3};
  border-top: 0;

  font-size: 12px;
  line-height: 14px;

  :not(:first-child) {
    border-left: none;
  }

  :not(:last-child) {
    border-right: none;
  }

  :last-child {
    padding-right: ${theme.size.sm};
  }

  ${({ cssProps }) => cssProps}

  @media (max-width: 900px) {
    min-width: 150px;
    ${({ cssOnMedia }) => cssOnMedia}
  }
`;
