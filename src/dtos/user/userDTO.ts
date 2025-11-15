import { ChurchDTO } from "@dtos/church";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  state: string;
  city: string;
  phone?: string;
  identityId: string;
  identityProvider: string;
  role: string;
  password: string;
  churchId?: string;
  church?: ChurchDTO;
}
