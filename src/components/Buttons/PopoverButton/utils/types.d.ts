import { ReactNode } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPopoverButton {
  label: string;
  hiddenIconButtonLabel?: boolean;
  message: {
    title: string;
    content: string;
    contentColor?: string | undefined;
  };
  actionButtonBgColor?: string;
  actionButtonClick: () => void;
  bgColor?: string;
  iconButtonColor?: string;
  type: 'IconButton' | 'Button';
  loading?: boolean;
  buttonIcon?: ReactNode;
  buttonIconSize?: string;
  borderless?: boolean;
  iconButtonClassName?: string;
  disabled?: boolean;
  hideLabelOnMedia?: boolean;
  labelPos?: 'left' | 'right' | 'top' | 'bottom';
  fontWeight?: string;
  textColor?: string;
  permToCheck?: string;
  hasCircle?: boolean;
  fill?: string;
  strokeColor?: string;
  buttonIcon?: React.ReactElement;
}
