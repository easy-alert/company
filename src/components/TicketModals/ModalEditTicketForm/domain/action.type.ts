import { TicketFieldKey } from './ticketFieldKey.type';
import { TicketFormConfig } from './ticketFormConfig.type';

export type Action =
  | { type: 'toggleHidden'; field: TicketFieldKey }
  | { type: 'toggleRequired'; field: TicketFieldKey }
  | { type: 'setConfig'; config: Partial<TicketFormConfig> };
