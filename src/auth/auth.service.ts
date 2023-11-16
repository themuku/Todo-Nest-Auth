import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register({ email, username, password }: RegisterUserDto) {
    try {
      if (!email && !password && !username) {
        throw new BadRequestException('All field are required');
      }

      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new ConflictException(
          'This email is already used by another user',
        );
      }

      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        throw new ConflictException(
          'This username is already used by another user',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async login({ username, email, password }: LoginUserDto) {
    try {
      if (!password) {
        throw new BadRequestException('Password is required');
      }

      if (username && !email) {
        const user = await this.prisma.user.findUnique({ where: { username } });

        const isValidPwd = await bcrypt.compare(user.password, password);

        if (!isValidPwd) {
          throw new ForbiddenException('Username or password is not valid');
        }

        return user;
      } else if (!username && email) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        const isValidPwd = await bcrypt.compare(user.password, password);

        if (!isValidPwd) {
          throw new ForbiddenException('Username or password is not valid');
        }
      } else {
        throw new BadRequestException('All fields are required');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
