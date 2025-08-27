import type { IBuilding } from './IBuilding';
import type { IUser } from './IUser';
import type { IStockItem } from './IStockItem';
import type { IStockMovement } from './IStockMovements';

export interface IStock {
  id: string;

  buildingId?: string;
  stockItemId?: string;
  createdById?: string;

  quantity?: number;
  minimumQuantity?: number;
  location?: string;
  notes?: string;
  lastUpdated?: string;
  isActive?: boolean;

  createdAt?: string;

  building?: IBuilding;
  stockItem?: IStockItem;
  createdBy?: IUser;

  movements?: IStockMovement[];
}

export interface IStockForm {
  buildingId: string;
  quantity: number;
  minimumQuantity: number;
  location?: string;
  notes?: string;
  stockItemId: string;
  isActive: boolean;
}

// model Stock {
//   id String @id @default(uuid())

//   buildingId  String
//   stockItemId String
//   createdById String?

//   quantity        Int      @default(0)
//   minimumQuantity Int      @default(0)
//   location        String?
//   notes           String?
//   lastUpdated     DateTime @default(now())
//   isActive        Boolean  @default(true)

//   createdAt DateTime @default(now())

//   building  Building  @relation(fields: [buildingId], references: [id])
//   stockItem StockItem @relation(fields: [stockItemId], references: [id])
//   createdBy User?     @relation(fields: [createdById], references: [id])

//   movements StockMovement[]

//   @@unique([buildingId, stockItemId])
//   @@index([stockItemId])
//   @@index([buildingId])
//   @@map("stocks")
// }
