import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from 'node-fetch';

// Configuración de la API backend NestJS
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Schemas de Zod para validación
const CreateTodoItemSchema = z.object({
  description: z.string(),
  listId: z.number(),
});

const CreateTodoListSchema = z.object({
  name: z.string(),
});

const UpdateTodoListSchema = z.object({
  listId: z.number(),
  name: z.string(),
});

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
            {
                name: "get_all_lists",
                description: "Obtiene todas las listas de tareas",
                inputSchema: {
                type: "object",
                properties: {},
                },
            },
            {
                name: "get_list",
                description: "Obtiene una lista específica por ID",
                inputSchema: {
                type: "object",
                properties: {
                    listId: {
                    type: "number",
                    description: "ID de la lista",
                    },
                },
                required: ["listId"],
                },
            },
            {
                name: "update_list",
                description: "Actualiza el nombre de una lista",
                inputSchema: {
                type: "object",
                properties: {
                    listId: {
                    type: "number",
                    description: "ID de la lista",
                    },
                    name: {
                    type: "string",
                    description: "Nuevo nombre de la lista",
                    },
                },
                required: ["listId", "name"],
                },
            },
            {
                name: "delete_list",
                description: "Elimina una lista de tareas",
                inputSchema: {
                type: "object",
                properties: {
                    listId: {
                    type: "number",
                    description: "ID de la lista a eliminar",
                    },
                },
                required: ["listId"],
                },
            },
            {
                name: "get_list_items",
                description: "Obtiene todos los items de una lista específica",
                inputSchema: {
                type: "object",
                properties: {
                    listId: {
                    type: "number",
                    description: "ID de la lista",
                    },
                },
                required: ["listId"],
                },
            },
            {
                name: "create_item",
                description: "Crea un nuevo item en una lista",
                inputSchema: {
                type: "object",
                properties: {
                    listId: {
                    type: "number",
                    description: "ID de la lista",
                    },
                    description: {
                    type: "string",
                    description: "Descripción del item",
                    },
                },
                required: ["listId", "description"],
                },
            },
            {
                name: "update_item_description",
                description: "Actualiza la descripción de un item",
                inputSchema: {
                type: "object",
                properties: {
                    itemId: {
                    type: "number",
                    description: "ID del item",
                    },
                    description: {
                    type: "string",
                    description: "Nueva descripción del item",
                    },
                },
                required: ["itemId", "description"],
                },
            },
            {
                name: "toggle_item_done",
                description: "Marca/desmarca un item como completado",
                inputSchema: {
                type: "object",
                properties: {
                    itemId: {
                    type: "number",
                    description: "ID del item",
                    },
                },
                required: ["itemId"],
                },
            },
            {
                name: "delete_item",
                description: "Elimina un item de la lista",
                inputSchema: {
                type: "object",
                properties: {
                    itemId: {
                    type: "number",
                    description: "ID del item a eliminar",
                    },
                },
                required: ["itemId"],
                },
            },
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

        switch (name) {
            case 'create_list':
            return await this.handleCreateList(args);
            case 'get_all_lists':
            return await this.handleGetAllLists(args);
            case 'get_list':
            return await this.handleGetList(args);
            case 'update_list':
            return await this.handleUpdateList(args);
            case 'delete_list':
            return await this.handleDeleteList(args);
            case 'get_list_items':
            return await this.handleGetListItems(args);
            case 'create_item':
            return await this.handleCreateItem(args);
            case 'update_item_description':
            return await this.handleUpdateItemDescription(args);
            case 'toggle_item_done':
            return await this.handleToggleItemDone(args);
            case 'delete_item':
            return await this.handleDeleteItem(args);
            
            default:
            throw new Error(`Tool desconocido: ${name}`);
        }
        }
    );
    }

    // === HANDLERS PARA TODOLIST ENDPOINTS ===

    async handleCreateList(args) {
    const validatedArgs = CreateTodoListSchema.parse(args);

    const response = await fetch(`${API_BASE_URL}/api/todolists`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedArgs),
    });

    if (!response.ok) {
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

    async handleGetAllLists(args) {
    const response = await fetch(`${API_BASE_URL}/api/todolists`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener listas: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const lists = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Listas encontradas:\n${JSON.stringify(lists, null, 2)}`
        }
        ]
    };
    }

    async handleGetList(args) {
    const validatedArgs = z.object({ listId: z.number() }).parse(args);
    
    const response = await fetch(`${API_BASE_URL}/api/todolists/${validatedArgs.listId}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener lista: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const list = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Lista encontrada:\n${JSON.stringify(list, null, 2)}`
        }
        ]
    };
    }

    async handleUpdateList(args) {
    const validatedArgs = UpdateTodoListSchema.parse(args);

    const response = await fetch(`${API_BASE_URL}/api/todolists/${validatedArgs.listId}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: validatedArgs.name }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar lista: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const updatedList = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Lista actualizada exitosamente:\n${JSON.stringify(updatedList, null, 2)}`
        }
        ]
    };
    }

    async handleDeleteList(args) {
    const validatedArgs = z.object({ listId: z.number() }).parse(args);
    
    const response = await fetch(`${API_BASE_URL}/api/todolists/${validatedArgs.listId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar lista: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return {
        content: [
        {
            type: "text",
            text: `Lista con ID ${validatedArgs.listId} eliminada exitosamente`
        }
        ]
    };
    }

    // === HANDLERS PARA TODOITEM ENDPOINTS ===

    async handleGetListItems(args) {
    const validatedArgs = z.object({ listId: z.number() }).parse(args);
    
    const response = await fetch(`${API_BASE_URL}/lists/${validatedArgs.listId}/items`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener items: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const items = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Items de la lista ${validatedArgs.listId}:\n${JSON.stringify(items, null, 2)}`
        }
        ]
    };
    }

    async handleCreateItem(args) {
    const validatedArgs = CreateTodoItemSchema.parse(args);

    const response = await fetch(`${API_BASE_URL}/lists/${validatedArgs.listId}/items`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: validatedArgs.description }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear item: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const newItem = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Item creado exitosamente:\n${JSON.stringify(newItem, null, 2)}`
        }
        ]
    };
    }

    async handleUpdateItemDescription(args) {
    const validatedArgs = z.object({ 
        itemId: z.number(), 
        description: z.string() 
    }).parse(args);
    
    const response = await fetch(`${API_BASE_URL}/items/${validatedArgs.itemId}/description`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: validatedArgs.description }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar descripción: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const updatedItem = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Descripción actualizada exitosamente:\n${JSON.stringify(updatedItem, null, 2)}`
        }
        ]
    };
    }

    async handleToggleItemDone(args) {
    const validatedArgs = z.object({ itemId: z.number() }).parse(args);
    
    const response = await fetch(`${API_BASE_URL}/items/${validatedArgs.itemId}/toggle-done`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al cambiar estado: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const updatedItem = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Estado del item cambiado exitosamente:\n${JSON.stringify(updatedItem, null, 2)}`
        }
        ]
    };
    }

    async handleDeleteItem(args) {
    const validatedArgs = z.object({ itemId: z.number() }).parse(args);
    
    const response = await fetch(`${API_BASE_URL}/items/${validatedArgs.itemId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar item: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return {
        content: [
        {
            type: "text",
            text: `Item con ID ${validatedArgs.itemId} eliminado exitosamente`
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