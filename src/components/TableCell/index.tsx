import { applyMask, dateTimeFormatter } from '@utils/functions';

import { theme } from '@styles/theme';

import * as Style from './styles';

export type TTableCellType =
  | 'string'
  | 'date'
  | 'datetime'
  | 'time'
  | 'currency'
  | 'phone'
  | 'currencyNibo'
  | 'cpfCnpj';

interface ITableCell extends React.HTMLAttributes<HTMLTableCellElement> {
  value?: string | number | null;
  type?: TTableCellType;
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
  type = 'date',
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

  const date = dateTimeFormatter(value?.toString() || '').split(',');

  return (
    <Style.TableCellContainer alignItems={alignItems} {...props}>
      <Style.TableCellText textSize={textSize}>{date[0]}</Style.TableCellText>
      {type === 'datetime' && (
        <Style.TableCellDescription subTextSize={subTextSize}>{date[1]}</Style.TableCellDescription>
      )}
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
    case 'datetime':
      return (
        <TableCellDate
          value={value}
          type={type}
          textSize={textSize}
          subTextSize={subTextSize}
          alignItems={alignItems}
          {...props}
        />
      );
    case 'phone':
      return (
        <TableCellString
          value={applyMask({ value: value?.toString() || '', mask: 'TEL' }).value}
          textSize={textSize}
          alignItems={alignItems}
          {...props}
        />
      );
    case 'currency':
      return (
        <TableCellString
          value={applyMask({ value: value?.toString() || '', mask: 'BRL' }).value}
          textSize={textSize}
          alignItems={alignItems}
          {...props}
        />
      );
    case 'currencyNibo':
      return (
        <TableCellString
          value={`R$ ${Number(value)?.toFixed(2).toString().replace('.', ',')}`}
          textSize={textSize}
          alignItems={alignItems}
          {...props}
        />
      );
    case 'cpfCnpj':
      return (
        <TableCellString
          value={
            value?.toString().length === 11
              ? applyMask({ value: value?.toString() || '', mask: 'CPF' }).value
              : applyMask({ value: value?.toString() || '', mask: 'CNPJ' }).value
          }
          textSize={textSize}
          alignItems={alignItems}
          {...props}
        />
      );

    default:
      return (
        <TableCellString
          value={value?.toString() || ''}
          textSize={textSize}
          alignItems={alignItems}
          {...props}
        />
      );
  }
}

export default TableCell;
