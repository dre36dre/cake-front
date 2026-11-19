import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express, { Request, Response } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import bootstrap from './main.server';

const app = express();
const port = process.env.PORT || 4000;
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');
const allowedHosts = [
  'localhost',
  '127.0.0.1',
  process.env.VERCEL_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
].filter((host): host is string => Boolean(host));
const commonEngine = new CommonEngine({ allowedHosts });

app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false
}));

app.get(/.*/, (req: Request, res: Response, next) => {
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${req.protocol}://${req.get('host') ?? 'localhost'}${req.originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    })
    .then(html => res.send(html))
    .catch(next);
});

// Inicializa o servidor
const server = app.listen(port, () => {
  console.log(`Angular Universal rodando na porta ${port}`);
});

// Captura erros corretamente
server.on('error', (err: Error) => {
  console.error('Erro ao iniciar servidor:', err);
});