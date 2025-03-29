import { Command } from "commander";
import { startCommandServer } from "./src/index-command.js";
import { startSSEServer } from "./src/index-sse.js";

// 设置环境变量，表示从CLI直接运行
process.env.DIRECT_RUN = "true";

const program = new Command();

program.name("mcp-cmp").description("MCP 组件服务 CLI").version("0.0.1");

// 检查是否设置了组件目录环境变量
const checkComponentsDir = () => {
  if (!process.env.COMPONENTS_DIR) {
    console.error("错误: 必须设置环境变量 COMPONENTS_DIR 指向组件文档目录");
    console.log("\n请使用以下方式之一设置环境变量:");
    console.log(
      "- 使用 --dir 选项: npx @fe-ai-demo/mcp-cmp start --dir ./path/to/docs"
    );
    console.log("- 设置环境变量: set COMPONENTS_DIR=./path/to/docs (Windows)");
    console.log(
      "- 设置环境变量: export COMPONENTS_DIR=./path/to/docs (Linux/Mac)"
    );
    process.exit(1);
  }
};

program
  .command("start")
  .description("以命令行模式启动 MCP 组件服务")
  .requiredOption("-d, --dir <path>", "组件文档目录路径 (必填)")
  .action(async (options) => {
    // 将命令行参数转为环境变量
    if (options.dir) {
      process.env.COMPONENTS_DIR = options.dir;
    }

    // 检查环境变量是否设置
    checkComponentsDir();

    await startCommandServer();
  });

program
  .command("serve")
  .description("以 SSE 服务器模式启动 MCP 组件服务")
  .requiredOption("-d, --dir <path>", "组件文档目录路径 (必填)")
  .option("-p, --port <port>", "指定端口号", "3000")
  .action(async (options) => {
    // 设置端口
    if (options.port) {
      process.env.PORT = options.port;
    }

    // 将命令行参数转为环境变量
    if (options.dir) {
      process.env.COMPONENTS_DIR = options.dir;
    }

    // 检查环境变量是否设置
    checkComponentsDir();

    await startSSEServer();
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
