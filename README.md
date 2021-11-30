# vite + react -> ssr

## 参考链接
- Vite 官方文档 - [https://cn.vitejs.dev/guide/ssr.html](https://cn.vitejs.dev/guide/ssr.html)
- Vite 官方 Demo - [https://github.com/vitejs/vite/tree/main/packages/playground/ssr-react](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-react)

## 启动命令

- 开发环境

  ```bash
  npm run dev
  ```

- 生产环境

  ```bash
  # 第一步 先将文件构建成服务端运行的 .js 文件
  npm run build

  # 第一步 启动服务端渲染服务
  npm run serve
  ```
