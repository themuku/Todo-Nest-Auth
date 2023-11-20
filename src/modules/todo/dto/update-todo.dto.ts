import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsBoolean()
  completed?: boolean;
}
