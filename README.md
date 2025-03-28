# fe-ai-demo

基于 pnpm + monorepo 的前端项目架构。

## 项目结构

```
fe-ai-demo/
├── packages/           # 子包目录
├── package.json        # 根目录配置文件
├── pnpm-workspace.yaml # pnpm工作区配置
├── tsconfig.json       # TypeScript配置
└── .npmrc              # npm配置
```

## 命令

- `pnpm build` - 构建所有包
- `pnpm lint` - 检查所有包的代码风格
- `pnpm test` - 运行所有包的测试
- `pnpm clean` - 清理所有包的构建产物

## 添加新的子包

在 `packages` 目录下创建新的子包目录，然后在其中初始化项目。

## 开发要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0
