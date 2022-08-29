import { parseJwt } from "@/util/parseJwt";

export function hasTokenExpired(token) {
  return Date.now() > parseJwt(token).exp * 1000;
}
