import { TicketFormConfig } from './ticketFormConfig.type';

const defaultConfig: Readonly<TicketFormConfig> = {
  residentName: { hidden: false, required: true },
  residentPhone: { hidden: false, required: true },
  residentApartment: { hidden: false, required: true },
  residentEmail: { hidden: false, required: true },
  residentCPF: { hidden: false, required: true },
  description: { hidden: false, required: true },
  placeId: { hidden: false, required: true },
  types: { hidden: false, required: true },
  attachments: { hidden: false, required: false },
};

export { defaultConfig };
