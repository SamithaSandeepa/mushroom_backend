// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { admin } from '../firebase/firebase.admin';

@Injectable()
export class AuthService {
  async createUser(data: {
    email: string;
    password: string;
    displayName?: string;
  }) {
    try {
      const userRecord = await admin.auth().createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      return userRecord;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
