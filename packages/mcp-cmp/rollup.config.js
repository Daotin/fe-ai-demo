import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// 复制文档的插件
const copyDocs = () => {
  return {
    name: "copy-docs",
    writeBundle: async () => {
      try {
        await fs.mkdir("dist/docs", { recursive: true });
        // 复制docs目录下的所有文件到dist/docs
        await execAsync("copyfiles -u 1 docs/**/* dist/docs");
        console.log("文档已复制到dist/docs目录");
      } catch (error) {
        console.error("复制文档失败:", error);
      }
    },
  };
};

// 外部依赖，不需要打包进结果
const external = [
  "@modelcontextprotocol/sdk/server/mcp.js",
  "@modelcontextprotocol/sdk/server/stdio.js",
  "@modelcontextprotocol/sdk/server/sse.js",
  "zod",
  "fs/promises",
  "path",
  "express",
  "morgan",
  "commander",
];

export default [
  // CLI打包
  {
    input: "cli.ts",
    output: {
      file: "dist/cli.js",
      format: "esm",
      banner: "#!/usr/bin/env node",
    },
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      json(),
      // copyDocs(),
    ],
  },
];
