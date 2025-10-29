export interface SignInInput {
  username: string;
  password: string;
}

export interface ConfirmResetPasswordInput {
  username: string;
  newPassword: string;
  confirmationCode: string;
}
