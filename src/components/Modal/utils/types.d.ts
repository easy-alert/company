export interface IModal {
  children: JSX.Element;
  id?: string;
  title: string;
  bodyWidth?: string;
  closeOutside?: boolean;
  deleteButton?: boolean;
  setModal: (setModal: boolean) => void;
  handleDelete?: (modalState: boolean) => void;
}
