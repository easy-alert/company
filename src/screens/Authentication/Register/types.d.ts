interface IFormDataCompany {
  image: string;
  name: string;
  email: string;
  companyName: string;
  contactNumber: string;
  CNPJorCPF: string;

  password: string;
  confirmPassword: string;
}

export interface IRequestCreateCompanyAndOWner {
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  values: IFormDataCompany;
  navigate: any;
  signin: any;
}
