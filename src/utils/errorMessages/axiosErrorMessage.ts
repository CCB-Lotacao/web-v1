import { AxiosError } from "axios";
import { Toast } from "@core/Toast";
import { useCustomerChurchErrorMessage, useCustomerUserErrorMessage } from ".";

export const axiosErrorMessage = (error: unknown, defaultMessage: string) => {
  if (isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as { message?: string | string[] };
    let messages: string[] = [];

    if (Array.isArray(errorData.message)) {
      messages = errorData.message;
    } else if (typeof errorData.message === "string") {
      messages = [errorData.message];
    }
    if (messages.length > 0) {
      messages.forEach((message) => {
        useCustomerUserErrorMessage(message);
        useCustomerChurchErrorMessage(message);
      });
      return;
    }
  }

  Toast.error(defaultMessage);
};

const isAxiosError = (error: unknown): error is AxiosError =>
  error !== null &&
  typeof error === "object" &&
  (error as { isAxiosError?: boolean }).isAxiosError === true;
