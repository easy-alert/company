import { useMemo, useReducer } from 'react';
import { Action } from '../domain/action.type';
import { defaultConfig } from '../domain/defaultConfig.constant';
import { TicketFieldKey } from '../domain/ticketFieldKey.type';
import { TicketFormConfig } from '../domain/ticketFormConfig.type';

function normalizeConfig(
  base: TicketFormConfig,
  incoming?: Partial<TicketFormConfig>,
): TicketFormConfig {
  const keys = Object.keys(base) as TicketFieldKey[];
  const entries = keys.map((key) => {
    const merged = { ...base[key], ...(incoming?.[key] ?? {}) };
    const normalized = merged.hidden && merged.required ? { ...merged, required: false } : merged;
    return [key, normalized];
  });
  return Object.fromEntries(entries) as TicketFormConfig;
}

function reducer(formState: TicketFormConfig, action: Action): TicketFormConfig {
  switch (action.type) {
    case 'toggleHidden': {
      const current = formState[action.field];
      const updated: TicketFormConfig = {
        ...formState,
        [action.field]: { ...current, hidden: !current.hidden },
      };
      return normalizeConfig(updated);
    }
    case 'toggleRequired': {
      const current = formState[action.field];
      const updated: TicketFormConfig = {
        ...formState,
        [action.field]: { ...current, required: !current.required },
      };
      return normalizeConfig(updated);
    }
    case 'setConfig':
      return normalizeConfig(formState, action.config);
    default:
      return formState;
  }
}

export function useEditTicketFormConfig(initial?: Partial<TicketFormConfig>) {
  const initialState = useMemo(() => normalizeConfig(defaultConfig, initial), [initial]);
  const [formState, dispatch] = useReducer(reducer, initialState);

  return {
    config: formState,
    toggleHidden: (field: TicketFieldKey) => dispatch({ type: 'toggleHidden', field }),
    toggleRequired: (field: TicketFieldKey) => dispatch({ type: 'toggleRequired', field }),
    setConfig: (config: Partial<TicketFormConfig>) => dispatch({ type: 'setConfig', config }),
  } as const;
}

