export interface IModal {
  title: string;
  children: JSX.Element;
  setModal: (setModal: boolean) => void;
  bodyWidth?: string;
}
