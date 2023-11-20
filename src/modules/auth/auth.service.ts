import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    if (!dto.email && !dto.password && !dto.username) {
      throw new BadRequestException('All field are required');
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new ConflictException('This email is already used by another user');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUsername) {
      throw new ConflictException(
        'This username is already used by another user',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
    });

    // const accessToken = await this.jwtService.sign({});
    const accessToken = null;

    return { ...newUser, accessToken };
  }

  async login(dto: LoginUserDto) {
    if (!dto.password) {
      throw new BadRequestException('Password is required');
    }

    if (dto.username && !dto.email) {
      const user = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });

      if (!user)
        throw new BadRequestException('User with this username not found');

      const isValidPwd = await bcrypt.compare(dto.password, user.password);

      if (!isValidPwd) {
        throw new ForbiddenException('Username or password is not valid');
      }

      return {
        username: user.username,
        email: user.email,
        id: user.id,
        accessToken: null,
      };
    } else if (dto.email && !dto.username) {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user)
        throw new BadRequestException('User with this email not found');

      const isValidPwd = await bcrypt.compare(dto.password, user.password);

      if (!isValidPwd) {
        throw new ForbiddenException('Username or password is not valid');
      }

      return {
        username: user.username,
        email: user.email,
        id: user.id,
        accessToken: null,
      };
    } else {
      throw new BadRequestException('All fields are required');
    }
  }
}
