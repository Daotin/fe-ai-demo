// index-sse.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import morgan from "morgan";
import { registerTools } from "../utils/index.js";

const PORT = process.env.PORT || 3000;

// 创建并启动SSE服务器
export const startSSEServer = async () => {
  // 创建MCP服务器
  const server = new McpServer({
    name: "mcp-cmp-sse",
    version: "1.0.0",
  });

  // 注册工具
  registerTools(server);

  // 创建Express应用
  const app = express();
  app.use(morgan("tiny"));

  // 存储每个连接的transport
  let transport: SSEServerTransport;

  // SSE端点
  app.get("/sse", async (req, res) => {
    console.log("新连接已建立");
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
  });

  // 消息处理端点
  app.post("/messages", async (req, res) => {
    console.log("收到新消息");
    await transport.handlePostMessage(req, res);
  });

  // 启动服务器
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`MCP SSE 服务器已启动，监听端口: ${PORT}`);
      resolve();
    });
  });
};

// 直接启动（用于独立运行此文件时）
if (process.env.DIRECT_RUN) {
  startSSEServer().catch((error) => {
    console.error("MCP SSE 服务器启动失败:", error);
    process.exit(1);
  });
}
