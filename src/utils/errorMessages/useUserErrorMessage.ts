import { defineMessages } from "react-intl";

import { Toast } from "@core/Toast";

export enum UserErrorMessages {
  USER_PASSWORD_INVALID = "Password is invalid credentials",
}

export const UserErrorModuleMessages = defineMessages({
  [UserErrorMessages.USER_PASSWORD_INVALID]: {
    defaultMessage: "Senha está errada!",
    id: "odnnHJ",
    description: "password invalid toast label",
  },
});

export const useCustomerUserErrorMessage = (message: string) => {
  switch (message) {
    case UserErrorMessages.USER_PASSWORD_INVALID:
      return Toast.error(
        UserErrorModuleMessages[UserErrorMessages.USER_PASSWORD_INVALID]
          .defaultMessage
      );
    default:
      return null;
  }
};
