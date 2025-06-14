import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TodoItemsController } from './todo_items.controller';

@Module({
  imports: [],
  controllers: [TodoListsController, TodoItemsController],
  providers: [
    { provide: TodoListsService, useValue: new TodoListsService([]) },
  ],
})
export class TodoListsModule {}
