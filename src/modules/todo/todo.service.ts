import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(id: string) {
    const todos = await this.prisma.todo.findMany({ where: { userId: id } });

    if (!todos.length) {
      throw new NotFoundException('Todos not found');
    }

    return todos;
  }

  async create(createTodoDto: CreateTodoDto) {
    return await this.prisma.todo.create({
      data: { title: createTodoDto.title, userId: createTodoDto.userId },
    });
  }

  async update(id: string, { title, completed }: UpdateTodoDto) {
    let updatedTodo;

    if (completed && title) {
      updatedTodo = { title, completed };
    } else if (completed && !title) {
      updatedTodo = { completed };
    } else if (!completed && title) {
      updatedTodo = { title };
    } else {
      throw new BadRequestException('One or many fields are required');
    }

    return await this.prisma.todo.update({
      where: {
        id,
      },
      data: updatedTodo,
    });
  }

  async delete(id: string) {
    const deletedTodo = await this.prisma.todo.delete({
      where: {
        id,
      },
    });

    if (!deletedTodo) throw new NotFoundException('Todo not found');

    return deletedTodo;
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException('Todo not found');

    return todo;
  }
}
