import styled from 'styled-components';

import { theme } from '@styles/theme';

interface ITableCell extends React.HTMLAttributes<HTMLTableCellElement> {
  alignItems: 'left' | 'center' | 'right';
}

interface TableCellText extends React.HTMLAttributes<HTMLParagraphElement> {
  textSize: keyof typeof theme.size;
}

interface TableCellDescription extends React.HTMLAttributes<HTMLParagraphElement> {
  subTextSize: keyof typeof theme.size;
}

export const TableCellContainer = styled.div<ITableCell>`
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems};
  gap: ${theme.size.xxsm};
`;

export const TableCellText = styled.p<TableCellText>`
  font-size: ${({ textSize }) => theme.size[textSize]};
  color: var(--color-text-secondary);
`;

export const TableCellDescription = styled.p<TableCellDescription>`
  font-size: ${({ subTextSize }) => theme.size[subTextSize]};
  color: var(--color-text-secondary);
`;
