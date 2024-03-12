export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  username: string;
}
