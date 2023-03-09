export interface SidebarContentProps {
  icon: string;
  url: string;
  redirectFunction: () => void;
}

export interface ISidebar {
  children: JSX.Element;
}
