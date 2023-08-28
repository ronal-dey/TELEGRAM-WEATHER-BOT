interface User {
  id: number;
  googleId: string;
  role: string;
}

const users: User[] = [];
let userIdCounter = 1;

export class UserStore {
  static addUser(user: User) {
    users.push(user);
  }

  static findUserByGoogleId(googleId: string): User | undefined {
    return users.find((user) => user.googleId === googleId);
  }

  static getNextUserId(): number {
    return userIdCounter++;
  }
}
