import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { setupTools } from './register-tools';

/**
 * Backward-compatible reference to the most recently created MCP Server instance.
 *
 * NOTE: This is intentionally no longer used as a singleton cache. Each call to
 * `getMcpServer()` now returns a fresh `Server` instance because the MCP SDK's
 * `Server.connect(transport)` throws `"Already connected to a transport"` if
 * the same `Server` is reused across multiple HTTP/SSE connections.
 *
 * See: https://github.com/hangwin/mcp-chrome/issues/321
 */
export let mcpServer: Server | null = null;

/**
 * Create a fresh MCP `Server` instance per connection.
 *
 * Rationale:
 * - Each HTTP (StreamableHTTP) / SSE transport must be paired with its own
 *   `Server` instance (per MCP SDK design).
 * - `setupTools()` is stateless — it only registers handlers on the given server,
 *   so creating a new instance per connection is cheap and safe.
 * - The stdio path uses `getStdioMcpServer()` in its own process and is unaffected.
 */
export const getMcpServer = (): Server => {
  const server = new Server(
    {
      name: 'ChromeMcpServer',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  setupTools(server);
  // Keep a reference to the latest instance for backward compatibility with any
  // external code importing `mcpServer` directly.
  mcpServer = server;
  return server;
};
