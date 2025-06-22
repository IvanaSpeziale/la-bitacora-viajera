import { Account } from "./account";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  country: string;
  account: Account;
}
