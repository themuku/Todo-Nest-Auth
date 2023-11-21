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
import { TokenService } from '../token/token.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterUserDto): Promise<RegisterResponseDto> {
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

    const user = {
      username: newUser.username,
      email: newUser.email,
      id: newUser.id,
    };

    return user;
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
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

      const accessToken = await this.tokenService.generateJwtToken(user.id);

      return {
        username: user.username,
        email: user.email,
        id: user.id,
        accessToken,
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

      const accessToken = await this.tokenService.generateJwtToken(user.id);

      return {
        username: user.username,
        email: user.email,
        id: user.id,
        accessToken,
      };
    } else {
      throw new BadRequestException('All fields are required');
    }
  }
}
