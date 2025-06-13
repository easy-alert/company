import { PopoverPosition } from 'react-tiny-popover';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPopoverButton {
  contentChildren: ReactElement;
  buttonChildren: ReactElement;
  label?: string;
  position?: PopoverPosition[];
  open?: boolean;
  chartColors?: string[];
  chartLabels?: string[];
}
