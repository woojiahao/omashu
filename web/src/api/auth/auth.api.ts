import { AxiosError, AxiosResponse } from "axios";
import { api, generateApi } from "../customAxios";

const registerErrors = [
  'User with email already exists',
  'User with username already exists',
  'Something went wrong on our end',
] as const;
export type RegisterError = typeof registerErrors[number];

export async function loginWithEmail(email: string, password: string) {
  try {
    const resp: AxiosResponse = await api.post('/auth/login/email', {
      email,
      password
    });
    return resp.status
  } catch (e) {
    const resp = (e as AxiosError).response;
    if (!resp) {
      return 500;
    }
    return resp.status;
  }
}

export async function registerWithEmail(email: string, username: string, password: string): Promise<null | [number, RegisterError]> {
  try {
    await api.post('/auth/register/email', {
      email,
      username,
      password
    });
    return null;
  } catch (e) {
    const resp = (e as AxiosError).response;
    if (!resp) {
      return [500, 'Something went wrong on our end'];
    }
    const data = resp.data as { message: RegisterError };
    return [resp.status, data.message];
  }
}

export async function logoutUser() {
  await api.post('/auth/logout');
}

export async function refreshToken() {
  const tempApi = generateApi();
  await tempApi.post('/auth/refresh');
}

export async function verify(token: string) {
  try {
    await api.post('/auth/verify', {
      token
    })

    return null;
  } catch (e) {
    const resp = (e as AxiosError).response;
    if (!resp) {
      return 'Something went wrong';
    }

    const data = resp.data as { message: string };

    return data.message
  }
}

export async function resendVerification() {
  await api.post('/auth/verify/resend')
}