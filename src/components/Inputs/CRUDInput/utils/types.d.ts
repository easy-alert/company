import { InputHTMLAttributes } from 'react';

export interface IDataList extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  disabled?: boolean;
  select: {
    createLabel: string;
    getEvtValue: (value: string) => void;
    options: {
      value: string;
      label: string;
    }[];
  };

  input: {
    placeholder: string;
    getEvtValue: (value: string) => void;
    onXClick: () => void;
  };
}
