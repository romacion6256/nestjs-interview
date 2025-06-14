import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];
  private readonly todoItems: TodoItem[];

  constructor(todoLists: TodoList[] = [],  todoItems: TodoItem[] = []) {
    this.todolists = todoLists;
    this.todoItems = todoItems;  
  }

  // servicio de listas
  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    return this.todolists.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.todolists.find((x) => x.id == Number(id));

    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id == Number(id));

    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }

  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }

  // servicio de items
  allItemsForList(listId: number): TodoItem[] {
    const list = this.get(listId);
    if (!list) throw new NotFoundException('Lista no encontrada');
    const itemsForList = this.todoItems.filter((item) => item.listId === listId);
    return itemsForList;
  }

  getItem(id: number): TodoItem {
    return this.todoItems.find((item) => item.id === Number(id));
  }

  createItem(dto: CreateTodoItemDto): TodoItem {
    const item: TodoItem = {
      id: this.nextItemId(),
      description: dto.description,
      done: false,
      listId: dto.listId,
    };

    this.todoItems.push(item);
    return item;
  }

  updateItemDescription(id: number, description: string): TodoItem {
    const item = this.getItem(id);
    if (!item) return null;

    item.description = description;
    return item;
  }

  toggleItemDone(id: number): TodoItem {
    const item = this.getItem(id);
    if (!item) return null;

    item.done = !item.done; // cambia true <-> false
    return item;
  }

  deleteItem(id: number): void {
    const index = this.todoItems.findIndex((item) => item.id === Number(id));
    if (index > -1) this.todoItems.splice(index, 1);
  }

  private nextItemId(): number {
    const last = this.todoItems.map((i) => i.id).sort().reverse()[0];
    return last ? last + 1 : 1;
  }

}
