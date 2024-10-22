export interface IModalCreateSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
}
