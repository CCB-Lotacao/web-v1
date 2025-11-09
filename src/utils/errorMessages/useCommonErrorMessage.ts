import { defineMessages } from "react-intl";

import { Toast } from "@core/Toast";

export enum CommonErrorMessages {
  COMMON_DUPLICATED_NAME = "A church with the name already exists",
}

export const CommonErrorModuleMessages = defineMessages({
  [CommonErrorMessages.COMMON_DUPLICATED_NAME]: {
    defaultMessage: "Já existe uma igreja com esse nome",
    id: "odnnHJ",
    description: "A church with the name already exists toast label",
  },
});

export const useCustomerCommonErrorMessage = (message: string) => {
  switch (message) {
    case CommonErrorMessages.COMMON_DUPLICATED_NAME:
      return Toast.error(
        CommonErrorModuleMessages[CommonErrorMessages.COMMON_DUPLICATED_NAME]
          .defaultMessage
      );
    default:
      return null;
  }
};
