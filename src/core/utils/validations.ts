export class Validators {
  static isLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }

  static isValidUser(value: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
    return usernameRegex.test(value);
  }

  static isSecurePassword(value: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!.])(?!.*[ ])[A-Za-z\d@#$%^&+=!]{8,}$/;
    return passwordRegex.test(value);
  }

  static isEmail(value: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
    return emailRegex.test(value);
  }

  static isNumber(value: string): boolean {
    const numberRegex = /^\d+$/;
    return numberRegex.test(value);
  }
}

export interface SignupValidation {
  name: string;
  surname: string;
  country: string;
  email: string;
  password: string;
}

export interface LoginValidation {
  email: string;
  password: string;
}
