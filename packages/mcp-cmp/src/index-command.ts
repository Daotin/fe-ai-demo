import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * 组件元数据类型定义
 */
interface ComponentMeta {
  name: string;
  description: string;
  props?: Record<string, string>;
}

/**
 * 简化版组件服务类，用于从目录中读取组件文档
 */
class SimpleComponentService {
  private componentsDir: string;

  constructor(componentsDir: string) {
    this.componentsDir = componentsDir;
    console.log(`ComponentService 初始化，组件目录: ${componentsDir}`);
  }

  /**
   * 获取所有组件元数据列表
   */
  async getComponentsList(): Promise<ComponentMeta[]> {
    console.log('正在读取组件目录...');

    // 读取组件目录下的所有文件
    const files = await fs.readdir(this.componentsDir);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));
    console.log(`找到 ${mdxFiles.length} 个 MDX 文件`);

    // 简化版解析，仅从文件名生成基本元数据
    const componentsMeta: ComponentMeta[] = [];
    for (const file of mdxFiles) {
      try {
        const name = path.basename(file, '.mdx');
        componentsMeta.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          description: `${name} 组件`, // 简化的描述
        });
      } catch (error) {
        console.error(`解析组件元数据失败 ${file}: ${error}`);
      }
    }

    return componentsMeta;
  }

  /**
   * 获取特定组件的详细信息
   */
  async getComponentDetail(componentName: string): Promise<string> {
    console.log(`正在查找组件: ${componentName}`);

    // 查找组件文件
    const files = await fs.readdir(this.componentsDir);
    const componentFile = files.find((file) => {
      const fileName = path.basename(file, path.extname(file));
      return fileName.toLowerCase() === componentName.toLowerCase();
    });

    if (!componentFile) {
      console.error(`组件未找到: ${componentName}`);
      throw new Error(`Component not found: ${componentName}`);
    }

    // 读取组件内容
    console.log(`读取组件内容: ${componentFile}`);
    const filePath = path.join(this.componentsDir, componentFile);
    const content = await fs.readFile(filePath, 'utf-8');

    return content;
  }
}

/**
 * 格式化组件列表
 */
function formatComponentsList(components: ComponentMeta[]): string {
  const result = ['Here are the available components:', ''];

  for (const component of components) {
    result.push(`- \`${component.name}\` - ${component.description}`);
  }
  return result.join('\n');
}

// 主函数，用于启动 MCP 服务
async function main() {
  // 1. 获取组件目录参数（默认为 docs/antd）
  const componentsDir = process.env.COMPONENTS_DIR || 'docs/element-ui';
  console.log(`启动 MCP 服务，组件目录: ${componentsDir}`);

  // 2. 创建组件服务实例
  const componentService = new SimpleComponentService(componentsDir);

  // 3. 创建 MCP 服务器
  const server = new McpServer({
    name: 'mdc-mcp-server',
    version: '1.0.0',
  });

  // 4. 注册获取组件列表工具
  server.tool('get_components_list', {}, async () => {
    try {
      const components = await componentService.getComponentsList();
      return {
        content: [{ type: 'text', text: formatComponentsList(components) }],
      };
    } catch (error) {
      console.error('获取组件列表错误:', error);
      throw error;
    }
  });

  // 5. 注册获取组件详情工具
  server.tool(
    'get_component_detail',
    {
      componentName: z.string({
        description: '要获取详情的组件名称',
      }),
    },
    async ({ componentName }) => {
      try {
        const content = await componentService.getComponentDetail(componentName);
        return {
          content: [{ type: 'text', text: content }],
        };
      } catch (error) {
        console.error('获取组件详情错误:', error);
        throw error;
      }
    }
  );

  // 6. 创建并连接标准输入/输出传输
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log('MCP 服务器已启动，等待请求...');
  console.log('按 Ctrl+C 退出服务');

  // 7. 保持进程运行，直到收到中断信号
  process.on('SIGINT', () => {
    console.log('正在关闭 MCP 服务...');
    process.exit(0);
  });
}

// 启动服务
main().catch((error) => {
  console.error('服务启动失败:', error);
  process.exit(1);
});
