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
  buttonIcon?: string;
  buttonIconSize?: string;
  borderless?: boolean;
  iconButtonClassName?: string;
  disabled?: boolean;
}
