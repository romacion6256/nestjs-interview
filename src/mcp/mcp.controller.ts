import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { MCP_TOOLS } from '../tools/todo.tools';
import { TodoListsService } from '../todo_lists/todo_lists.service';

@Controller('mcp')
export class McpController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Get('tools')
  getTools() {
    return MCP_TOOLS;
  }

  @Post('invoke')
  async invokeTool(@Body() body: any) {
    const { function: func, arguments: args } = body;

    switch (func) {
      case 'create_todo_item':
        return this.todoListsService.createItem({
          listId: args.listId,
          description: args.description,
        });

      case 'update_todo_item_description':
        return this.todoListsService.updateItemDescription(args.itemId, args.description);

      case 'toggle_todo_item_done':
        return this.todoListsService.toggleItemDone(args.itemId);

      default:
        throw new NotFoundException('Tool no reconocida');
    }
  }
}
