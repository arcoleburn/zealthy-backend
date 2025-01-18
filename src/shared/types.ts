export interface CreateUserBody {
  email: string;
  pw: string;
  aboutMe: string;
  birthday: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}
