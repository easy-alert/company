export const STOCK_MOVEMENT_TYPE_VALUES = [
  'REGISTRATION',
  'INCOMING',
  'OUTGOING',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'ADJUSTMENT',
  'LOSS',
  'DAMAGED',
  'DELETED',
  'REMOVAL',
] as const;
export type TStockMovementType = (typeof STOCK_MOVEMENT_TYPE_VALUES)[number];

export const STOCK_MOVEMENT_TYPE_SELECT = [
  'INCOMING',
  'OUTGOING',
  'TRANSFER_OUT',
  'LOSS',
  'DAMAGED',
] as const;
export type TStockMovementTypeSelect = (typeof STOCK_MOVEMENT_TYPE_SELECT)[number];
