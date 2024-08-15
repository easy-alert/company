import { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<SelectHTMLAttributes> {
  label?: string;
  error?: string;
}
