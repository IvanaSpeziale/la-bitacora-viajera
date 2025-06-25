import { Account } from "../entities/account";

export class EditUserDTO {
  public id: string;
  public name: string;
  public surname: string;
  public email: string;
  public country: string;
  public is_admin?: boolean;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    country: string,
    is_admin?: boolean
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.country = country;
    this.is_admin = is_admin;
  }
}
