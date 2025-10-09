import { useMemo, useReducer } from 'react';

export type TicketFieldKey =
  | 'residentName'
  | 'residentPhone'
  | 'residentApartment'
  | 'residentEmail'
  | 'residentCPF'
  | 'description'
  | 'placeId'
  | 'types'
  | 'attachments';

export interface TicketFieldState {
  hidden: boolean;
  required: boolean;
}

export type TicketFormConfig = Record<TicketFieldKey, TicketFieldState>;

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

type Action =
  | { type: 'toggleHidden'; field: TicketFieldKey }
  | { type: 'toggleRequired'; field: TicketFieldKey }
  | { type: 'setConfig'; config: Partial<TicketFormConfig> };

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

