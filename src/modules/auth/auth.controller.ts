import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('API')
  @ApiResponse({ status: 200, type: RegisterUserDto })
  @Post('register')
  register(
    @Body(ValidationPipe) dto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @Post('login')
  login(@Body(ValidationPipe) dto: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
