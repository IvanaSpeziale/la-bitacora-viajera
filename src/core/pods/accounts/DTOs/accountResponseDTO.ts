export class AccountResponseDTO {
  public accountId: string;
  public username: string;
  public email: string;
  constructor(accountId: string, username: string, email: string) {
    this.accountId = accountId;
    this.username = username;
    this.email = email;
  }
}
