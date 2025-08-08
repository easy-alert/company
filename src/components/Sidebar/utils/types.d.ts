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
  order?: number;
  type: 'navigate' | 'popover';
  options?: IBase[];
}
