import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('id') id: string) {
    return this.todoService.findAll(id);
  }

  @ApiTags('API')
  @ApiResponse({ status: 201, type: CreateTodoDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: UpdateTodoDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) todo: UpdateTodoDto) {
    return this.todoService.update(id, todo);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }
}
