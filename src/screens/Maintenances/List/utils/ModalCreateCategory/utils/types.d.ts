import { ICategories } from '../../types';

export interface IModalCreateCategory {
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  setModal: (setModal: boolean) => void;
}

// FORM
export interface IFormDataCategory {
  categoryName: string;
}

export interface IRequestCreateCategory {
  values: IFormDataCategory;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
}
