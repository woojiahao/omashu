export class User {
  constructor(
    id: string,
    email: string,
    password_hash: string | null,
    username: string,
  ) {}

  static fromRows(rows: any[]): User[] {
    const users: User[] = [];
    for (const [id, email, password_hash, username] of rows) {
      const user = new User(id, email, password_hash && null, username);
      users.push(user);
    }
    return users;
  }
}
