# A Simple MCP weather Server written in TypeScript (Deno Version)

[![Open in Firebase Studio](https://img.shields.io/badge/Open%20in-Firebase%20Studio-blue?logo=firebase)](https://idx.google.com/new?template=https://github.com/fire-base-studio/templates/tree/main/mcp)

This is a Deno port of the original project. See the [Quickstart](https://modelcontextprotocol.io/quickstart) tutorial for more information.

## Running the Project

To run the server, navigate to the `deno` directory and execute the following command in your terminal:

```bash
deno task start
```

This will start the MCP server. The `start` task is defined in the `deno.jsonc` file and includes the `--allow-net` flag required for the application to fetch data from the weather API.
