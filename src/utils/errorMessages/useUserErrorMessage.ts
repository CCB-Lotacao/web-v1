import { defineMessages } from "react-intl";

import { Toast } from "@core/Toast";

export enum UserErrorMessages {
  USER_DUPLICATED_EMAIL = "User with email already exists",
}

export const UserErrorModuleMessages = defineMessages({
  [UserErrorMessages.USER_DUPLICATED_EMAIL]: {
    defaultMessage: "Usuário com e-mail já existe",
    id: "odnnHJ",
    description: "User with email already exists toast label",
  },
});

export const useCustomerUserErrorMessage = (message: string) => {
  switch (message) {
    case UserErrorMessages.USER_DUPLICATED_EMAIL:
      return Toast.error(
        UserErrorModuleMessages[UserErrorMessages.USER_DUPLICATED_EMAIL]
          .defaultMessage
      );
    default:
      return null;
  }
};
