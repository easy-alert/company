import { ICategories } from '../../types';

export interface IModalCreateCategory {
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setModal: (setModal: boolean) => void;
}

// FORM
export interface IFormDataCategory {
  categoryName: string;
}

export interface IRequestCreateCategory {
  values: IFormDataCategory;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
}
