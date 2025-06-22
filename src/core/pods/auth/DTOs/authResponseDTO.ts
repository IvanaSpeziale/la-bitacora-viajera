export class AuthResponseDTO {
  public token: string;
  public accountId: string;
  public email: string;
  constructor(token: string, accountId: string, email: string) {
    this.token = token;
    this.accountId = accountId;
    this.email = email;
  }
}
