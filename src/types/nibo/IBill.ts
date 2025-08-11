interface Stakeholder {
  cpfCnpj: string;
  id: string;
  name: string;
  isDeleted: boolean;
}

interface Category {
  id: string;
  name: string;
  isDeleted: boolean;
}

interface OriginSchedule {
  costCenters: any[]; // You might want to define a type for costCenters if you know its structure
  scheduleId: string;
  isEntry: boolean;
  isBill: boolean;
  isDebitNote: boolean;
  isFlagged: boolean;
  isDued: boolean;
  dueDate: string; // ISO 8601 date string
  scheduleDate: string; // ISO 8601 date string
  createDate: string; // ISO 8601 date string
  value: number;
  isPaid: boolean;
  costCenterValueType: number;
  paidValue: number;
  openValue: number;
  stakeholderId: string;
  stakeholder: Stakeholder;
  description: string;
  category: Category;
  categories: Category[];
  hasInstallment: boolean;
  hasRecurrence: boolean;
  hasOpenEntryPromise: boolean;
  hasEntryPromise: boolean;
  autoGenerateEntryPromise: boolean;
  hasInvoice: boolean;
  hasPendingInvoice: boolean;
  hasScheduleInvoice: boolean;
  autoGenerateNFSeType: number;
  autoGenerateCollectionType: number;
  isPaymentScheduled: boolean;
}

interface EditedBy {
  UserId: string;
  Date: string; // ISO 8601 date string
}

interface CustomAttributes {
  deliveryType: number;
  editedBy: EditedBy;
}

export interface IBill {
  id: string;
  originScheduleId: string;
  dueDate: string; // ISO 8601 date string
  paidAt?: string; // ISO 8601 date string
  value: number;
  paidValue?: number;
  createAt: string; // ISO 8601 date string
  status: number;
  statusDescription: string;
  externalId: string;
  url: string;
  emails: string;
  opens: number;
  barcode: string;
  automaticallyGenerated: boolean;
  customAttributes: CustomAttributes;
  originSchedule: OriginSchedule;
}
