export interface CreateUserDTO {
  email: string;
  name: string;
  phone?: string;
  state?: string;
  city?: string;
  password?: string;
  churchId?: string;
}
