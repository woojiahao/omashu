import { AxiosResponse } from 'axios';
import { api } from "../customAxios";
import { User } from "./user";

export async function getCurrentUser() {
  const resp = await api.get('/users/current') as AxiosResponse;
  const user = resp.data as User;
  return user;
}