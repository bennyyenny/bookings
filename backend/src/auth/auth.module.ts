// auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { GoogleStrategy } from './google.strategy.js';

import { UserService } from '../user/user.service.js';
import { JwtGuardStrategy } from './jwt-auth.strategy.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '3d',
        },
        global: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuardStrategy, GoogleStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}
