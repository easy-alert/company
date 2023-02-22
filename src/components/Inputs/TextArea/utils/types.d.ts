import { TextareaHTMLAttributes } from 'react';

export interface ITextArea extends TextareaHTMLAttributes<TextareaHTMLAttributes> {
  label?: string;
  height?: string;
  showTextLengthCounter?: boolean;
  textLength?: number;
}
