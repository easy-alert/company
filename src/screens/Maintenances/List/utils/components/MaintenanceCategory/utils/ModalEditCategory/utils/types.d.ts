import { ICategories } from '../../../../../types';

interface IFormDataEditCategory {
  categoryName: string;
}

export interface IEditCategory {
  categoryId: string;
  values: IFormDataEditCategory;
  setModal: (setModal: boolean) => void;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IDeleteCategory {
  categoryId: string;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IModalCreateMaintenance {
  categoryId: string;
  categoryName: string;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setModal: (setModal: boolean) => void;
}
