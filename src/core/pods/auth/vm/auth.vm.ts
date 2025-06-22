import { LoginValidation, SignupValidation } from "@/core/utils/validations";
import { User } from "../entities/user";
import { EditUserDTO } from "../../users/DTOs/editUserDTO";

export interface AuthContextType {
  checkingSession: boolean;
  isLoggedIn: boolean;
  accountId: string | null;
  email: string | null;
  user: User | null;
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
}
