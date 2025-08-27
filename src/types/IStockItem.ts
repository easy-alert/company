import type { IBuilding } from './IBuilding';
import type { IStock } from './IStock';
import type { IStockItemType } from './IStockItemType';
import type { IStockMovement } from './IStockMovements';

export interface IStockItem {
  id: string;

  companyId?: string;
  buildingId?: string;
  stockItemTypeId?: string;

  name?: string;
  description?: string;
  unit?: string;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;

  // company: ICompany;
  building?: IBuilding;
  stockItemType?: IStockItemType;

  stocks?: IStock[];
  movements?: IStockMovement[];

  _count?: {
    stocks?: number;
    movements?: number;
  };
}

export interface IStockItemForm {
  name: string;
  description?: string;
  unit: string;
  stockItemTypeId: string;
  isActive: boolean;
}

// model StockItem {
//   id String @id @default(uuid())

//   companyId       String
//   buildingId      String?
//   stockItemTypeId String

//   name        String
//   description String?
//   unit        String
//   isActive    Boolean @default(true)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   company       Company       @relation(fields: [companyId], references: [id], onDelete: Cascade)
//   building      Building?     @relation(fields: [buildingId], references: [id], onDelete: Cascade)
//   stockItemType StockItemType @relation(fields: [stockItemTypeId], references: [id])

//   stocks    Stock[]
//   movements StockMovement[]

//   @@unique([companyId, name, buildingId])
//   @@index([companyId])
//   @@index([buildingId])
//   @@map("stockItems")
// }
