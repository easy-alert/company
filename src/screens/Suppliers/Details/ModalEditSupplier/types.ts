import type { ISupplier } from '@customTypes/ISupplier';

export interface IModalEditSupplier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
  supplier: ISupplier;
}
