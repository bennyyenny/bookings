// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateGoogleUser(profile: any) {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.create({
        email,
        name,
      });
    }

    return user;
  }

  async oAuthLogin(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwt = await this.jwtService.signAsync(payload);
    return { jwt };
  }
}
