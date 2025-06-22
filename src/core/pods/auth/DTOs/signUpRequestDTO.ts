export class SignupRequestDTO {
  public name: string;
  public surname: string;
  public email: string;
  public password: string;
  public confirmPassword?: string;
  public country: string;

  constructor(
    name: string,
    surname: string,
    email: string,
    password: string,
    country: string
  ) {
    this.email = email;
    this.password = password;
    this.surname = surname;
    this.country = country;
    this.confirmPassword = password;
    this.name = name;
    this.surname = surname;
  }
}
