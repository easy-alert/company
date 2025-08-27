export const TStockMovements = [
  'INCOMING',
  'OUTGOING',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'ADJUSTMENT',
  'LOSS',
  'DAMAGED',
] as const;
export type TStockMovements = (typeof TStockMovements)[number];
