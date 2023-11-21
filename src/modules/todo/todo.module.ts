import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from '../../strategies';

@Module({
  providers: [TodoService, PrismaService, JwtStrategy],
  controllers: [TodoController],
})
export class TodoModule {}
