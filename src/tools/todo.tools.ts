export const MCP_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'create_todo_item',
      description: 'Crea un ítem en una lista de tareas',
      parameters: {
        type: 'object',
        properties: {
          listId: { type: 'number', description: 'ID de la lista' },
          description: { type: 'string', description: 'Descripción del ítem' }
        },
        required: ['listId', 'description']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'update_todo_item_description',
      description: 'Actualiza la descripción de un ítem',
      parameters: {
        type: 'object',
        properties: {
          itemId: { type: 'number', description: 'ID del ítem' },
          description: { type: 'string', description: 'Nueva descripción' }
        },
        required: ['itemId', 'description']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'toggle_todo_item_done',
      description: 'Alterna el estado de completado (hecho/no hecho) de un ítem',
      parameters: {
        type: 'object',
        properties: {
          itemId: { type: 'number', description: 'ID del ítem' }
        },
        required: ['itemId']
      }
    }
  }
];
