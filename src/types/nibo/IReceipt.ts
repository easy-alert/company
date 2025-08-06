interface IStatus {
  code: number;
  description: string;
}

interface ISchedule {
  id: string;
  dueDate: string; // ISO 8601 date string
  scheduleDate: string; // ISO 8601 date string
  value: number;
  description: string;
  isDeleted: boolean;
}

interface IAddress {
  uf: string;
  city: string;
  postalCode: string;
  district: string;
  complement: string;
  address: string;
  number: string;
}

interface ICustomer {
  cpfCnpj: string;
  email: string;
  legalType: string;
  name: string;
  address: IAddress;
}

interface ITaxDetails {
  aliquot: number;
  retained: boolean;
  retainedDescription?: string; // Optional as it might not always be present
  value: number;
  reductionBase?: number; // Optional
}

interface IFederalTaxDetails {
  aliquot: number;
  value: number;
}

interface IService {
  description: string;
  operationType: string;
  cityServiceCode: string;
  removeISSValueFromBaseValueToCalculatePISAndCOFINS: boolean;
  iss: ITaxDetails;
  pis: ITaxDetails;
  cofins: ITaxDetails;
  csll: ITaxDetails;
  ir: ITaxDetails;
  inss: ITaxDetails;
  federalTax: IFederalTaxDetails;
}

interface IStakeholder {
  id: string;
  name: string;
  isDeleted: boolean;
  type: string;
}

interface IConstruction {
  address: object; // You might want to define a more specific type for address if it's not empty
}

// interface IEvent {
//   // Define the structure of the event object if you know it
// }

export interface IReceipt {
  id: string;
  provider: string;
  status: IStatus;
  lastMessage: string;
  lastStatusMessage: string;
  lastStatusChange: string; // ISO 8601 date string
  schedule: ISchedule;
  rpsNumber: number;
  rpsSeries: string;
  accrualRpsDate: string; // ISO 8601 date string
  verificationCode: string;
  number: string;
  authorizeDate: string; // ISO 8601 date string
  createDate: string; // ISO 8601 date string
  createUser: string;
  updateDate: string; // ISO 8601 date string
  updateUser: string;
  pdfFileId: string;
  pdfFileUrl: string;
  xmlFileId: string;
  xmlFileUrl: string;
  remarks: string;
  deductions: number;
  discounts: number;
  value: number;
  serviceProfile: {
    id: string;
    name: string;
    isDeleted: boolean;
  };
  customer: ICustomer;
  service: IService;
  stakeholder: IStakeholder;
  construction: IConstruction;
  // event: IEvent;
  serviceProviderDocumentNumber: string;
}
