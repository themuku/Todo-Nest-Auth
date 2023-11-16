import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/todo-dto';
import { Cookies } from 'src/decorators/CookiesDecorator';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  // @Post()
  // create(@Body('title') title: string) {
  //   return this.todoService.create(title);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() todo: CreateTodoDto) {
    return this.todoService.update(id, todo);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }
}
