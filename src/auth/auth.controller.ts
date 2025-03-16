// backend/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public route to create a new user in Firebase Authentication.
  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; displayName?: string },
  ) {
    const { email, password, displayName } = body;
    const userRecord = await this.authService.createUser({
      email,
      password,
      displayName,
    });
    return { user: userRecord };
  }

  // Public placeholder route – normally sign in is handled by the Firebase client.
  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    return { message: 'Sign in is handled by the Firebase SDK on the client' };
  }

  // Protected route: only accessible with a valid Firebase token.
  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return { user: req.user };
  }

  // Public route example.
  @Get('public')
  publicEndpoint() {
    return { message: 'This is a public endpoint' };
  }
}
