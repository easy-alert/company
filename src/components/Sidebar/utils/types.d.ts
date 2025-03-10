interface IBase {
  icon: any;
  url: string;
  redirectFunction: () => void;
  label?: string;
  title?: string;
  permission?: string;
  fill?: string;
  strokeColor?: string;
}

export interface SidebarContentProps extends IBase {
  type: 'navigate' | 'popover';
  options?: IBase[];
}
