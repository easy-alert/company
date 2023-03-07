import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

export const Background = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 ${theme.size.xxsm};
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRowHead = styled.tr<{ bgColor?: string }>``;

export const TableRow = styled.tr<{ bgColor?: string }>`
  ${({ bgColor }) => bgColor && `background-color: ${theme.color.white};`};
  :hover {
    cursor: pointer;
    background-color: ${`${theme.color.white}B3`};
  }
`;

export const TableColHeader = styled.th<{ cssProps: any; cssOnMedia: any }>`
  color: ${theme.color.gray4};
  text-align: start;
  :first-child {
    padding-left: ${theme.size.sm};
  }
  ${({ cssProps }) => cssProps}
  min-width: 160px;
  padding-inline: 8px;

  @media (max-width: 900px) {
    ${({ cssOnMedia }) => cssOnMedia}
  }
`;

export const TableColBody = styled.td<{
  textAlign?: string;
  cssProps: any;
  cssOnMedia: any;
}>`
  height: ${theme.size.xxlg};
  padding-inline: 8px;
  overflow-wrap: break-word;
  text-align: start;
  min-width: 160px;

  :nth-child(1) {
    border-radius: ${theme.size.xxsm} 0px 0px ${theme.size.xxsm};
    padding-left: ${theme.size.sm};
  }

  :nth-child(5) {
    min-width: 200px;
    max-width: 200px;
  }
  :nth-child(6) {
    min-width: 200px;
    max-width: 200px;
  }

  :last-of-type {
    border-radius: 0px ${theme.size.xxsm} ${theme.size.xxsm} 0px;
    padding-right: ${theme.size.sm};
  }

  ${({ cssProps }) => cssProps}

  @media (max-width: 900px) {
    min-width: 150px;
    ${({ cssOnMedia }) => cssOnMedia}
  }
`;
