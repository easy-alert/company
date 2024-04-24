interface IBase {
  icon: string;
  url: string;
  redirectFunction: () => void;
  label?: string;
  title?: string;
}

export interface SidebarContentProps extends IBase {
  type: 'navigate' | 'popover';
  options?: IBase[];
}
