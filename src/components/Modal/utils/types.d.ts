export interface IModal {
  children: JSX.Element;
  id?: string;
  title: string;
  bodyWidth?: string;
  closeOutside?: boolean;
  setModal: (setModal: boolean) => void;
}
