import { applyMask, dateTimeFormatter } from '@utils/functions';

import { theme } from '@styles/theme';

import * as Style from './styles';

interface ITableCell extends React.HTMLAttributes<HTMLTableCellElement> {
  value?: string | null;
  type?: 'string' | 'date' | 'datetime' | 'time' | 'currency' | 'phone';

  textSize?: keyof typeof theme.size;
  subTextSize?: keyof typeof theme.size;
  alignItems?: 'left' | 'center' | 'right';
}

function TableCellString({ value, textSize = 'sm', alignItems = 'left', ...props }: ITableCell) {
  const formattedValue = value || '-';

  return (
    <Style.TableCellContainer alignItems={alignItems} {...props}>
      <Style.TableCellText textSize={textSize}>{formattedValue}</Style.TableCellText>
    </Style.TableCellContainer>
  );
}

function TableCellDate({
  value,
  textSize = 'sm',
  subTextSize = 'xsm',
  alignItems = 'left',
  ...props
}: ITableCell) {
  if (!value) {
    return (
      <Style.TableCellContainer alignItems={alignItems} {...props}>
        <Style.TableCellText textSize={textSize}>-</Style.TableCellText>
      </Style.TableCellContainer>
    );
  }

  const date = dateTimeFormatter(value).split(',');

  return (
    <Style.TableCellContainer alignItems={alignItems} {...props}>
      <Style.TableCellText textSize={textSize}>{date[0]}</Style.TableCellText>
      <Style.TableCellDescription subTextSize={subTextSize}>{date[1]}</Style.TableCellDescription>
    </Style.TableCellContainer>
  );
}

function TableCell({
  value,
  type = 'string',
  textSize = 'csm2',
  subTextSize = 'csm',
  alignItems = 'left',
  ...props
}: ITableCell) {
  if (!value) {
    return (
      <Style.TableCellContainer alignItems={alignItems} {...props}>
        <Style.TableCellText textSize={textSize}>-</Style.TableCellText>
      </Style.TableCellContainer>
    );
  }

  switch (type) {
    case 'date':
      return (
        <TableCellDate
          value={value}
          textSize={textSize}
          subTextSize={subTextSize}
          alignItems={alignItems}
          {...props}
        />
      );
    case 'phone':
      return (
        <TableCellString
          value={applyMask({ value, mask: 'TEL' }).value}
          textSize={textSize}
          alignItems={alignItems}
          {...props}
        />
      );
    default:
      return (
        <TableCellString value={value} textSize={textSize} alignItems={alignItems} {...props} />
      );
  }
}

export default TableCell;
