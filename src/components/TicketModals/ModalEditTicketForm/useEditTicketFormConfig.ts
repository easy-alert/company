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

const defaultConfig: TicketFormConfig = {
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
  | { type: 'setConfig'; config: Partial<TicketFormConfig> }
  | { type: 'reset'; config?: Partial<TicketFormConfig> };

function enforceConstraints(state: TicketFormConfig): TicketFormConfig {
  const next: TicketFormConfig = { ...state } as TicketFormConfig;
  (Object.keys(next) as TicketFieldKey[]).forEach((key) => {
    const field = next[key];
    if (field.hidden && field.required) {
      next[key] = { ...field, required: false };
    }
  });
  return next;
}

function mergeConfig(
  base: TicketFormConfig,
  incoming?: Partial<TicketFormConfig>,
): TicketFormConfig {
  if (!incoming) return base;
  const merged: TicketFormConfig = { ...base } as TicketFormConfig;
  (Object.keys(incoming) as TicketFieldKey[]).forEach((key) => {
    const inc = incoming[key];
    if (!inc) return;
    merged[key] = { ...merged[key], ...inc };
  });
  return merged;
}

function reducer(state: TicketFormConfig, action: Action): TicketFormConfig {
  switch (action.type) {
    case 'toggleHidden': {
      const current = state[action.field];
      const updated: TicketFormConfig = {
        ...state,
        [action.field]: { ...current, hidden: !current.hidden },
      } as TicketFormConfig;
      return enforceConstraints(updated);
    }
    case 'toggleRequired': {  
      const current = state[action.field];
      const updated: TicketFormConfig = {
        ...state,
        [action.field]: { ...current, required: !current.required },
      } as TicketFormConfig;
      return enforceConstraints(updated);
    }
    case 'setConfig': {
      const config = mergeConfig(state, action.config);
      return enforceConstraints(config);
    }
    case 'reset': {
      const resetConfig = mergeConfig(defaultConfig, action.config);
      return enforceConstraints(resetConfig);
    }
    default:
      return state;
  }
}

export function useEditTicketFormConfig(initial?: Partial<TicketFormConfig>) {
  const initialState = useMemo(
    () => enforceConstraints(mergeConfig(defaultConfig, initial)),
    [initial],
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  const configArray = useMemo(
    () =>
      (Object.keys(state) as TicketFieldKey[]).map((key) => ({
        key,
        ...state[key],
      })),
    [state],
  );

  const getPayload = () => ({ ...state });

  return {
    state,
    configArray,
    toggleHidden: (field: TicketFieldKey) => dispatch({ type: 'toggleHidden', field }),
    toggleRequired: (field: TicketFieldKey) => dispatch({ type: 'toggleRequired', field }),
    setConfig: (config: Partial<TicketFormConfig>) => dispatch({ type: 'setConfig', config }),
    reset: (config?: Partial<TicketFormConfig>) => dispatch({ type: 'reset', config }),
    getPayload,
  } as const;
}

