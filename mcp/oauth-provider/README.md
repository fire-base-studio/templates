# MCP Server: In-Memory OAuth Provider Example

This template demonstrates how to implement a simple in-memory OAuth provider for an MCP (Moxy-Cloud-Platform) server. It's an excellent starting point for understanding and testing authentication flows in MCP without needing external services.

<a href="https://idx.google.com/new?template=https://github.com/fire-base-studio/templates/tree/main/mcp" target="_blank"><img src="https://idx.dev/btn/open_in_idx_dark.svg" alt="Open in IDX" /></a>

## What's Inside?

*   **`src/index.ts`**: The main server file. It sets up an MCP server with an in-memory OAuth 2.0 provider, including endpoints for authorization and token exchange.
*   **`package.json`**: Defines the project dependencies and a simple `start` script.
*   **`.idx/dev.nix`**: The IDX development environment configuration. It installs Node.js, runs `npm install` on creation, and starts the server automatically.

## How to Use

This template is designed to work out-of-the-box in IDX.

1.  **Click the "Open in IDX" button** above.
2.  The workspace will automatically install the dependencies (`npm install`).
3.  The development server will start automatically (`npm run start`).

Once the server is running, you can interact with the OAuth endpoints as described in the MCP documentation.
