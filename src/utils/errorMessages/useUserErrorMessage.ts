import { defineMessages } from "react-intl";

import { Toast } from "@core/Toast";

export enum UserErrorMessages {
  USER_DUPLICATED_EMAIL = "User with email already exists",
  PASSWORD_INVALID = "Password is invalid credentials",
  EMAIL_INVALID = "Email is invalid credentials",
}

export const UserErrorModuleMessages = defineMessages({
  [UserErrorMessages.USER_DUPLICATED_EMAIL]: {
    defaultMessage: "Usuário com e-mail já existe",
    id: "odnnHJ",
    description: "User with email already exists toast label",
  },
  [UserErrorMessages.PASSWORD_INVALID]: {
    defaultMessage:
      "Não foi possível realizar o login, tente novamente mais tarde",
    id: "user.password.invalid",
    description: "We were unable to log in, please try again later toast label",
  },
  [UserErrorMessages.EMAIL_INVALID]: {
    defaultMessage:
      "Não foi possível realizar o login, tente novamente mais tarde",
    id: "user.email.invalid",
    description: "We were unable to log in, please try again later toast label",
  },
});

export const useCustomerUserErrorMessage = (message: string) => {
  switch (message) {
    case UserErrorMessages.USER_DUPLICATED_EMAIL:
      return Toast.error(
        UserErrorModuleMessages[UserErrorMessages.USER_DUPLICATED_EMAIL]
          .defaultMessage
      );
    case UserErrorMessages.PASSWORD_INVALID:
      return Toast.error(
        UserErrorModuleMessages[UserErrorMessages.PASSWORD_INVALID]
          .defaultMessage
      );
    case UserErrorMessages.EMAIL_INVALID:
      return Toast.error(
        UserErrorModuleMessages[UserErrorMessages.EMAIL_INVALID].defaultMessage
      );
    default:
      return null;
  }
};
