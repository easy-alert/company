/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes } from 'react';

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelColor?: string;
  errorColor?: string;
  error?: string | null | any;
  disable?: boolean;
  size?: string;
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}
