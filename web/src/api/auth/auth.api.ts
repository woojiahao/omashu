import { api, generateApi } from "../customAxios";

export async function loginWithEmail(email: string, password: string) {
  // TODO: Raise exception here or move it to the login call
  await api.post('/auth/login/email', {
    email,
    password
  });
}

export async function registerWithEmail(email: string, username: string, password: string) {
  await api.post('/auth/register', {
    email,
    username,
    password
  })
}

export async function logoutUser() {
  await api.post('/auth/logout');
}

export async function refreshToken() {
  const tempApi = generateApi();
  await tempApi.post('/auth/refresh');
}