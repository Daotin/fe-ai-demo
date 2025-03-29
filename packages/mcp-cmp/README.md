# MCP 组件服务

基于 MCP 协议的组件服务，提供组件文档查询功能。

> 文档目录要求：
> 本服务需要指定组件文档目录，可通过以下方式之一设置：
>
> 1. 使用命令行参数 `--dir` 指定（推荐）
> 2. 设置环境变量 `COMPONENTS_DIR`
>
> 文档目录应包含 Markdown 格式（.md）的组件文档文件。

## 本地测试

0、安装和打包

```bash
pnpm install

pnpm run build
```

1、对于 `mcp-cmp-command`，直接添加 Cursor MCP

2、对于 `mcp-cmp-sse`，需要先在本地运行：

```bash
# 该指令在子包@fe-ai-demo/mcp-cmp根目录下运行
node dist/cli.js serve --dir docs/element-ui
```

### Cursor MCP 配置示例

```json
{
  "mcpServers": {
    "mcp-cmp-command": {
      "type": "command",
      "command": "node",
      "args": [
        "D:\\Gitee\\fe-ai-demo\\packages\\mcp-cmp\\dist\\cli.js",
        "start",
        "--dir",
        "D:\\Gitee\\fe-ai-demo\\packages\\mcp-cmp\\docs\\element-ui"
      ]
    },
    "mcp-cmp-sse": {
      "type": "http",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

## npx 使用方式

### command 模式

```bash
# 指定组件文档目录
npx -y @fe-ai-demo/mcp-cmp start --dir ./path/to/docs
```

### SSE 模式

```bash
# 默认端口 3000
npx -y @fe-ai-demo/mcp-cmp serve --dir ./path/to/docs

# 指定端口
npx -y @fe-ai-demo/mcp-cmp serve --dir ./path/to/docs -p 8080
```

### Cursor MCP 配置示例

```json
{
  "mcpServers": {
    "mcp-cmp-command": {
      "type": "command",
      "command": "npx",
      "args": [
        "-y",
        "@fe-ai-demo/mcp-cmp",
        "start",
        "--dir",
        "D:\\Gitee\\fe-ai-demo\\packages\\mcp-cmp\\docs\\element-ui"
      ]
    },
    "mcp-cmp-sse": {
      "type": "http",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

## 可用工具

- `get_components_list`: 获取所有可用的组件列表
- `get_component_detail`: 获取特定组件的详细文档
