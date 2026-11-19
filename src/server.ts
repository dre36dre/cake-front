import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express, { Request, Response } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppServerModule } from './main.server';

const app = express();
const port = process.env.PORT || 4000;
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');
const commonEngine = new CommonEngine();

app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false
}));

app.get(/.*/, (req: Request, res: Response, next) => {
  commonEngine
    .render({
      bootstrap: AppServerModule,
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