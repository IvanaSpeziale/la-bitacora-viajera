import { LoginValidation, SignupValidation } from "@/core/utils/validations";
import { User } from "../entities/user";
import { EditUserDTO } from "../DTOs/editUserDTO";

export interface AuthContextType {
  checkingSession: boolean;
  isLoggedIn: boolean;
  accountId: string | null;
  email: string | null;
  user: User | null;
  users: User[] | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<LoginValidation>;
  signup: (
    name: string,
    surname: string,
    country: string,
    email: string,
    password: string
  ) => Promise<SignupValidation>;
  editUser: (user: EditUserDTO) => Promise<void>;
  editAdminUser: (user: EditUserDTO) => Promise<void>;
  fetchAdminUsers: () => Promise<User[] | null>;
  fetchAdminUserById: (id: string) => Promise<User | null>;
  deleteUser: (id: string) => Promise<void>;
}
