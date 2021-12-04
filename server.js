const fs = require('fs');
const path = require('path');
const express = require('express');
const { createServer: createViteServer } = require('vite');

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
) {
  const resolve = p => path.join(__dirname, p);
  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf8')
    : '';

  const app = express();

  // 以中间件模式创建 Vite 应用，这将禁用 Vite 自身的 HTML 服务逻辑
  // 并让上级服务器接管控制
  /**
   * @type {import('vite'.ViteDevServer)}
   */
  let vite;
  
  if (!isProd) {
    vite = await createViteServer({
      root,
      logLevel: 'info',
      // 如果你想使用 Vite 自己的 HTML 服务逻辑（将 Vite 作为一个开发中间件来使用），那么这里请用 'html'
      server: { middlewareMode: 'ssr' },
    });
    // 使用 vite 的 Connect 实例作为中间件
    app.use(vite.middlewares);
  } else {
    app.use(require('compression')());
    app.use(express.static(
      resolve('dist/client'),
      {
        index: false,
      },
    ));
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;

      if (!isProd) {
        // 开发模式下每次重新获取模板
        template = fs.readFileSync(resolve('index.html'), 'utf8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = indexProd;
        render = require('./dist/server/entry-server.js').render;
      }

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url)
      }

      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error)
      console.log(error)
      res.status(500).end(error.message)
    }
  });

  return { app, vite };
}

// bootstrap
createServer().then(({ app }) => {
  app.listen(3000, '0.0.0.0', () => {
    console.log('[ssr] Server run at 3000.');
  })
});
