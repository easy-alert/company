export interface IIconButton {
  icon: ReactNode;
  gap?: string;
  color?: string;
  label?: string;
  opacity?: string;
  className?: string;
  labelPos?: 'left' | 'right' | 'top' | 'bottom';
  selected?: boolean;
  onClick: (evt?) => void;
  onAuxClick?: (evt?) => void;
  hideLabelOnMedia?: boolean;
  fontWeight?: string;
  size?: string;
  disabled?: boolean;
  title?: string;
  loading?: boolean;
  tabIndex?: number;
  permToCheck?: string;
  zIndex?: number;
}
