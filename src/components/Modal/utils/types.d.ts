export interface IModal {
  children: JSX.Element;
  id?: string;
  title: string;
  bodyWidth?: string;
  closeOutside?: boolean;
  maintenanceHistoryId?: string;
  zIndex?: number;
  setModal: (setModal: boolean) => void;
  handleDelete?: (modalState: boolean) => void;
  handleEdit?: (modalState: boolean) => void;
}
