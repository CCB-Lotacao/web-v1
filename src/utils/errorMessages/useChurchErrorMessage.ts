import { defineMessages } from "react-intl";

import { Toast } from "@core/Toast";

export enum ChurchErrorMessages {
  CHURCH_DUPLICATED_NAME = "A church with the name already exists",
}

export const ChurchErrorModuleMessages = defineMessages({
  [ChurchErrorMessages.CHURCH_DUPLICATED_NAME]: {
    defaultMessage: "Já existe uma igreja com esse nome",
    id: "odnnHJ",
    description: "A church with the name already exists toast label",
  },
});

export const useCustomerChurchErrorMessage = (message: string) => {
  switch (message) {
    case ChurchErrorMessages.CHURCH_DUPLICATED_NAME:
      return Toast.error(
        ChurchErrorModuleMessages[ChurchErrorMessages.CHURCH_DUPLICATED_NAME]
          .defaultMessage
      );
    default:
      return null;
  }
};
