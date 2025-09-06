import type { IBuilding } from './IBuilding';
import type { IStock } from './IStock';
import type { IStockItem } from './IStockItem';
import type { IUser } from './IUser';
import type { TStockMovements } from './TStockMovements';

export interface IStockMovement {
  id?: string;

  companyId?: string;
  stockId?: string;
  stockItemId?: string;
  lastUpdatedById?: string;
  transferToId?: string;

  quantity?: number;
  previousBalance?: number;
  newBalance?: number;
  referenceNumber?: string;
  notes?: string;

  movementType?: TStockMovements;
  movementDate?: string;

  // company?: ICompany;
  stock?: IStock;
  stockItem?: IStockItem;
  lastUpdatedBy?: IUser;
  transferTo?: IBuilding;
}

export interface IStockMovementForm {
  stockId: string;
  movementType: TStockMovements;
  quantity: number;
  notes?: string;
  transferToId: string;
}

// model StockMovement {
//   id String @id @default(uuid())

//   companyId       String
//   stockId         String
//   stockItemId     String
//   lastUpdatedById String?
//   transferToId    String?

//   quantity        Int
//   previousBalance Int
//   newBalance      Int
//   referenceNumber String?
//   notes           String?
//   movementType    StockMovementType
//   movementDate    DateTime          @default(now())

//   company       Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
//   stock         Stock     @relation(fields: [stockId], references: [id])
//   stockItem     StockItem @relation(fields: [stockItemId], references: [id])
//   lastUpdatedBy User?     @relation(fields: [lastUpdatedById], references: [id])
//   transferTo    Building? @relation(fields: [transferToId], references: [id])

//   @@index([stockItemId])
//   @@index([stockId])
//   @@index([lastUpdatedById])
//   @@index([movementDate])
//   @@map("stockMovements")
// }
