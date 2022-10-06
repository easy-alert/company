import { ICategories } from '../../../../../types';

interface IFormDataEditCategory {
  categoryName: string;
}

export interface IEditCategory {
  categoryId: string;
  values: IFormDataEditCategory;
  setModal: (setModal: boolean) => void;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IDeleteCategory {
  categoryId: string;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IModalCreateMaintenance {
  categoryId: string;
  categoryName: string;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  setModal: (setModal: boolean) => void;
}
