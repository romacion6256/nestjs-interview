import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from 'node-fetch';

// Configuración de la API backend NestJS
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Schemas de Zod para validación
const TodoItemSchema = z.object({
  id: z.number(),
  description: z.string(),
  done: z.boolean(),
  listId: z.number(),
});

const TodoListSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const CreateTodoItemSchema = z.object({
  description: z.string(),
  listId: z.number().optional(),
  listName: z.string().optional(),
});

const CreateTodoListSchema = z.object({
  name: z.string(),
});

const UpdateTodoListSchema = z.object({
  listId: z.number(),
  name: z.string(),
});

const UpdateTodoItemSchema = z.object({
  itemId: z.number(),
  description: z.string(),
});

// Tipos TypeScript derivados de los schemas
type TodoItem = z.infer<typeof TodoItemSchema>;
type TodoList = z.infer<typeof TodoListSchema>;
type CreateTodoItemDto = z.infer<typeof CreateTodoItemSchema>;
type CreateTodoListDto = z.infer<typeof CreateTodoListSchema>;

class TodoMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "nestjs-todolist-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
  }

  // === FUNCIONES AUXILIARES ===
  /*private async findListByName(listName: string): Promise<TodoList | null> {
    const response = await fetch(`${API_BASE_URL}/lists`);
    if (!response.ok) {
      throw new Error(`Error al buscar lista: ${response.statusText}`);
    }
    const lists: TodoList[] = await response.json();
    return lists.find(list => list.name.toLowerCase() === listName.toLowerCase()) || null;
  }

  private async getAllItemsFromAllLists(): Promise<TodoItem[]> {
    const listsResponse = await fetch(`${API_BASE_URL}/lists`);
    if (!listsResponse.ok) {
      throw new Error(`Error al obtener listas: ${listsResponse.statusText}`);
    }
    const lists: TodoList[] = await listsResponse.json();
    
    const itemPromises = lists.map(async (list) => {
      const itemsResponse = await fetch(`${API_BASE_URL}/lists/${list.id}/items`);
      if (itemsResponse.ok) {
        return await itemsResponse.json();
      }
      return [];
    });
    
    const allItemsArrays = await Promise.all(itemPromises);
    return allItemsArrays.flat();
  }*/

  private setupTools() {
    this.server.setRequestHandler(
        z.object({ method: z.literal('tools/list') }),
        async (request) => {
        return {
            tools: [
            {
                name: "create_list",
                description: "Crea una nueva lista de tareas",
                inputSchema: {
                type: "object",
                properties: {
                    name: {
                    type: "string",
                    description: "Nombre de la lista",
                    },
                },
                required: ["name"],
                },
            },
            // ... otros tools
            ],
        };
        }
    );

    // Registrar el handler para tools/call
    this.server.setRequestHandler(
        z.object({
        method: z.literal('tools/call'),
        params: z.object({
            name: z.string(),
            arguments: z.any(),
        }),
        }),
        async (request) => {
        const { name, arguments: args } = request.params;
        
        console.log('Tool llamado:', name);
        console.log('Args recibidos:', args);
        console.log('Tipo de args:', typeof args);

        switch (name) {
            case 'create_list':
            return await this.handleCreateList(args);
            
            default:
            throw new Error(`Tool desconocido: ${name}`);
        }
        }
    );
    }

    async handleCreateList(args) {
    const validatedArgs = CreateTodoListSchema.parse(args);
    
    console.log('Haciendo request a:', `${API_BASE_URL}/api/todolists`);
    console.log('Con datos:', validatedArgs);

    const response = await fetch(`${API_BASE_URL}/api/todolists`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedArgs),
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    if (!response.ok) {
        // Obtener más detalles del error
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`Error al crear lista: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const newList = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Lista creada exitosamente:\n${JSON.stringify(newList, null, 2)}`
        }
        ]
    };
    }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Servidor MCP NestJS TodoList iniciado");
  }
}

// Iniciar el servidor
const server = new TodoMCPServer();
server.run().catch(console.error);