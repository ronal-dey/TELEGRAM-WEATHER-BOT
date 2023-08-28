// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { UserStore } from '../user/user-store'; // Corrected path

@Injectable()
export class AuthService {
  async findOrCreateUser(profile: any): Promise<any> {
    const existingUser = UserStore.findUserByGoogleId(profile.id);

    if (existingUser) {
      return existingUser;
    }

    const newUser = {
      id: UserStore.getNextUserId(),
      googleId: profile.id,
      role: 'user',
    };

    UserStore.addUser(newUser);
    return newUser;
  }
}
