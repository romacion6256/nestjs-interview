import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TodoItemsController } from './todo_items.controller';
import { McpController } from '../mcp/mcp.controller';


@Module({
  imports: [],
  controllers: [TodoListsController, TodoItemsController, McpController],
  providers: [
    { provide: TodoListsService, useValue: new TodoListsService([]) },
  ],
})
export class TodoListsModule {}
