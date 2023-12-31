import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
