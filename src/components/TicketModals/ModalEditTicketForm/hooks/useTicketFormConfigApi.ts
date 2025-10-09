import { Api } from '@services/api';
import { TicketFormConfig } from './useEditTicketFormConfig';

export function useTicketFormConfigApi() {
  const loadConfig = async (): Promise<Partial<TicketFormConfig>> => {
    const response = await Api.get<Partial<TicketFormConfig>>('/ticket-form-config');
    return response.data;
  };

  const saveConfig = async (payload: TicketFormConfig): Promise<void> => {
    await Api.put<Partial<TicketFormConfig>>('/ticket-form-config', payload);
  };

  return { loadConfig, saveConfig } as const;
}
