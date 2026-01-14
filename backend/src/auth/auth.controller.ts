// src/auth/auth.controller.ts
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { JwtGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 👉 Start Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect handled by passport
  }

  // 👉 Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { jwt } = await this.authService.oAuthLogin(req.user);

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // IMPORTANT for OAuth
      path: '/',
    });

    res.redirect('http://localhost:3000');
  }

  // 👉 Check current user (JWT protected)
  @Get('me')
  @UseGuards(JwtGuard)
  getCurrentUser(@Req() req) {
    // only keep the info you need for frontend
    const { sub, name, email } = req.user;
    return {
      isAuthenticated: true,
      user: { sub, name, email }, // this is what frontend sees
    };
  }

  // 👉 Logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
