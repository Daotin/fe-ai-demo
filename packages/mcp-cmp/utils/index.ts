import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// 获取组件目录的默认路径
export const getComponentsDir = () => {
  // 只使用环境变量，没有默认值
  if (!process.env.COMPONENTS_DIR) {
    throw new Error("必须设置环境变量 COMPONENTS_DIR 指向组件文档目录");
  }
  return process.env.COMPONENTS_DIR;
};

// 注册公共工具到MCP服务器
export const registerTools = (server: McpServer) => {
  // 获取组件列表工具
  server.tool("get_components_list", "获取所有可用的组件列表", {}, async () => {
    try {
      // 尝试获取组件目录
      let COMPONENTS_DIR;
      try {
        COMPONENTS_DIR = getComponentsDir();
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `${error.message}\n\n请使用以下命令设置环境变量后重试:\n- Windows: set COMPONENTS_DIR=您的文档目录路径\n- Linux/Mac: export COMPONENTS_DIR=您的文档目录路径`,
            },
          ],
          isError: true,
        };
      }

      try {
        // 检查目录是否存在
        await fs.access(COMPONENTS_DIR, fs.constants.R_OK);
      } catch (error) {
        // 友好的错误提示
        return {
          content: [
            {
              type: "text",
              text: `组件目录不存在或无法访问: ${COMPONENTS_DIR}\n\n请确保该目录存在并且有读取权限。`,
            },
          ],
          isError: true,
        };
      }

      // 读取组件目录下的所有文件
      const files = await fs.readdir(COMPONENTS_DIR);
      const mdxFiles = files.filter((file) => file.endsWith(".md"));

      // 简单格式化组件列表输出
      const componentsList = mdxFiles
        .map((file) => {
          const name = path.basename(file, ".md"); // 去掉文件扩展名
          return `- ${name}`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `可用组件列表：\n${componentsList}`,
          },
        ],
      };
    } catch (error: any) {
      console.error("读取组件列表失败:", error);
      return {
        content: [{ type: "text", text: `获取组件列表失败: ${error.message}` }],
        isError: true,
      };
    }
  });

  // 获取组件详情工具
  server.tool(
    "get_component_detail",
    "获取特定组件的详细文档",
    {
      componentName: z.string({
        description: "组件名称",
      }),
    },
    async ({ componentName }) => {
      try {
        // 尝试获取组件目录
        let COMPONENTS_DIR;
        try {
          COMPONENTS_DIR = getComponentsDir();
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `${error.message}\n\n请使用以下命令设置环境变量后重试:\n- Windows: set COMPONENTS_DIR=您的文档目录路径\n- Linux/Mac: export COMPONENTS_DIR=您的文档目录路径`,
              },
            ],
            isError: true,
          };
        }

        try {
          // 检查目录是否存在
          await fs.access(COMPONENTS_DIR, fs.constants.R_OK);
        } catch (error) {
          // 友好的错误提示
          return {
            content: [
              {
                type: "text",
                text: `组件目录不存在或无法访问: ${COMPONENTS_DIR}\n\n请确保该目录存在并且有读取权限。`,
              },
            ],
            isError: true,
          };
        }

        // 查找对应组件文件
        const filePath = path.join(COMPONENTS_DIR, `${componentName}.md`);

        // 直接读取并返回文件内容
        const content = await fs.readFile(filePath, "utf-8");

        return {
          content: [{ type: "text", text: content }],
        };
      } catch (error: any) {
        console.error(`获取组件 ${componentName} 详情失败:`, error);
        return {
          content: [
            { type: "text", text: `获取组件详情失败: ${error.message}` },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
};
