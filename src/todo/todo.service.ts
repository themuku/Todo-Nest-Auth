import { ConsoleLogger, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/todo-dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.todo.findMany();
  }

  // async create(title: string) {
  //   const todo = await this.prisma.todo.create({}});

  //   return todo;
  // }

  async update(id: string, { title, completed }: CreateTodoDto) {
    const todo = await this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        completed,
      },
    });

    return todo;
  }

  async delete(id: string) {
    const todo = await this.prisma.todo.delete({
      where: {
        id,
      },
    });

    return todo;
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    return todo;
  }
}
