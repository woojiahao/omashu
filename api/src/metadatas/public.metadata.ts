import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../constants";

export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}