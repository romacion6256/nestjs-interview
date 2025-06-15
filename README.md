# nextjs-interview / TodoApi

[![Open in Coder](https://dev.crunchloop.io/open-in-coder.svg)](https://dev.crunchloop.io/templates/fly-containers/workspace?param.Git%20Repository=git@github.com:crunchloop/nextjs-interview.git)

This is a simple Todo List API built in Nest JS and Typescript. This project is currently being used for Javascript/Typescript full-stack candidates.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Check integration tests at: (https://github.com/crunchloop/interview-tests)

# =====================================

# Pasos a realizar para probar los endpoints REST agregados y hacer uso de ellos a través de un cliente MCP (Claude Desktop)

1) Luego de clonar el repositorio, instalar las dependencias: *npm install*.

2) *Importante*. Asegurarse de ejecutar *npm run build* para la compilación del servidor (sin este paso no se podrá hacer uso de la herramienta MCP).

3) Se asume que se tiene Claude Desktop (cliente MCP para este caso). De no ser así, se puede instalar aquí: https://claude.ai/download

4) Una vez dentro de Claude Desktop (esta explicación es para windows, para mac o algún otro SO podría ser diferente) seguir la siguente ruta para acceder al archivo de configuración (claude_desktop_config):

```bash
# Tres barritas(superior izquierda)>Archivo>Configuración>Desarrollador>Editar configuración 
# (Atajo: Ctrl+coma>Desarrollador>Editar configuración)
```

Estas rutas llevan a la ubicación del archivo de configuración.

5) Abrir este archivo en un editor de texto y colocar lo siguiente:
```bash
{
  "mcpServers": {
    "nestjs-todolist-server": {
      "command": "node",
      "args": ["ruta/al/archivo/dist/mcp/src/mcp-server.js"] # ruta al servidor luego de la compilación
    }
  }
}
```
6) Guardar los cambios y reiniciar Claude Desktop. En la próxima apertura de Claude, este leerá automaticamente el archivo y sabrá que existe un servidor con ese nombre, en esa ruta y además sabrá como ejecutarlo.

7) Por último, para poder usar los endpoints REST a través de Claude, correr la app con *npm run start*.

8) Una vez la app este corriendo, Claude ya estará pronto para poder realizar llamada a la API en base a lo que le pidas en lenguaje natural.