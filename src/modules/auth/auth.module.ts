import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, TokenService],
})
export class AuthModule {}
