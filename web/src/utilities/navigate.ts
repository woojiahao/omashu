import { ToastMessageType } from "../components/Layout";
import { NavigateFunction, createSearchParams } from "react-router-dom";

export function navigateWithToast(
  navigate: NavigateFunction,
  to: string,
  message: string,
  messageType: ToastMessageType) {
  navigate({
    pathname: to,
    search: createSearchParams({
      'message': message,
      'message-type': messageType,
    }).toString()
  });
}