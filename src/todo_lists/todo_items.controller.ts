import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { TodoListsService } from './todo_lists.service';
import { CreateTodoItemDto } from './dtos/create-todo_item';

@Controller()
export class TodoItemsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Get('lists/:id/items')
  getItems(@Param('id') listId: number) {
    const items = this.todoListsService.allItemsForList(listId);
    if (!items) throw new NotFoundException('Items no encontrados');
    return items;
  }

  @Post('lists/:id/items')
  create(
    @Param('id') listId: number,
    @Body() body: Omit<CreateTodoItemDto, 'listId'>,
  ) {
    const list = this.todoListsService.get(listId);
    if (!list) throw new NotFoundException('Lista no encontrada');

    return this.todoListsService.createItem({ ...body, listId });
  }

  @Patch('items/:id/description')
  updateDescription(
    @Param('id') itemId: number,
    @Body() body: { description: string },
    ) {
    const updated = this.todoListsService.updateItemDescription(itemId, body.description);
    if (!updated) throw new NotFoundException('Item no encontrado');

    return updated;
  }

  @Patch('items/:id/toggle-done')
  toggleDone(@Param('id') itemId: number) {
    const updated = this.todoListsService.toggleItemDone(itemId);
    if (!updated) throw new NotFoundException('Item no encontrado');

    return updated;
  }

  @Delete('items/:id')
  delete(@Param('id') itemId: number) {
    const item = this.todoListsService.getItem(itemId);
    if (!item) throw new NotFoundException('Item no encontrado');

    this.todoListsService.deleteItem(itemId);
    return { success: true };
  }
}
