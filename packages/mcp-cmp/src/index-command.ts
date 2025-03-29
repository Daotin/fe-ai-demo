// index-cmd.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "../utils/index.js";

// 创建MCP服务器
const server = new McpServer({
  name: "mcp-cmp-command",
  version: "1.0.0",
});

// 注册工具
registerTools(server);

// 启动命令行服务器
export const startCommandServer = async () => {
  console.log("命令行模式 MCP 服务器正在启动...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP 服务器已启动，等待命令中...");
};

// 直接启动（用于独立运行此文件时）
if (process.env.DIRECT_RUN) {
  startCommandServer().catch((error) => {
    console.error("MCP 服务器启动失败:", error);
    process.exit(1);
  });
}
