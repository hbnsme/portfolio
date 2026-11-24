import { defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const reviewIndex = new URL('./local-review/pdf-sources.json', import.meta.url);
const visualIndex = new URL('./local-review/visual-sources.json', import.meta.url);
const releaseRoot = new URL('./local-review/release-candidates/', import.meta.url);
const reviewEntry = '/__report-review/release/';
const reviewAccessHelp = `<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>请从本机打开审核总览</title>
<h1>请从本机打开审核总览</h1>
<p>浏览器将这次访问标记为跨来源。请在地址栏粘贴当前地址后按回车，或使用下方的本机入口。</p>
<p><a href="${reviewEntry}" rel="noreferrer">继续打开本机审核总览</a></p>
</html>`;

export default defineConfig({
  base: './',
  server: {
    host: '127.0.0.1',
    strictPort: true,
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/local-review/**'] },
  },
  plugins: [{
    name: 'local-report-review',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__report-review', async (request, response) => {
        const host = request.headers.host ?? '';
        const socket = request.socket.remoteAddress;
        const site = request.headers['sec-fetch-site'];
        const url = request.url ?? '';
        const overview = url === '/release' || url === '/release/';
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(socket ?? '') ||
            !/^127\.0\.0\.1(?::\d+)?$/.test(host)) {
          response.writeHead(403).end();
          return;
        }
        if ((site && site !== 'same-origin' && site !== 'none') ||
            (request.headers.origin && request.headers.origin !== `http://${host}`)) {
          if (overview && request.method === 'GET' && request.headers['sec-fetch-mode'] === 'navigate' &&
              request.headers['sec-fetch-dest'] === 'document') {
            response.writeHead(403, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store',
              'X-Content-Type-Options': 'nosniff',
              'Cross-Origin-Resource-Policy': 'same-origin',
              'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
            }).end(reviewAccessHelp);
          } else {
            response.writeHead(403).end();
          }
          return;
        }
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.writeHead(405, { Allow: 'GET, HEAD' }).end();
          return;
        }
        try {
          if (overview) {
            const body = await readFile(new URL('overview.html', releaseRoot));
            response.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Content-Length': body.length,
              'Cache-Control': 'no-store',
              'X-Content-Type-Options': 'nosniff',
              'Cross-Origin-Resource-Policy': 'same-origin',
              'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
            }).end(request.method === 'HEAD' ? undefined : body);
            return;
          }
          const asset = /^\/release\/(reports\/[a-z-]+\.pdf|images\/[a-z-]+\.jpg)$/.exec(url);
          if (asset) {
            const manifest = JSON.parse(await readFile(new URL('manifest.json', releaseRoot), 'utf8'));
            const entry = manifest.assets.find((item: { candidate?: string }) => item.candidate === asset[1]);
            if (!entry) throw new Error('Unknown release asset');
            const body = await readFile(new URL(asset[1], releaseRoot));
            if (createHash('sha256').update(body).digest('hex') !== entry.sha256) {
              throw new Error('Release candidate changed');
            }
            response.writeHead(200, {
              'Content-Type': asset[1].endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
              'Content-Length': body.length,
              'Cache-Control': 'no-store',
              'X-Content-Type-Options': 'nosniff',
              'Cross-Origin-Resource-Policy': 'same-origin',
            }).end(request.method === 'HEAD' ? undefined : body);
            return;
          }
          const visual = /^\/visual\/([a-z-]+)(?:\/([a-z-]+))?$/.exec(request.url ?? '');
          if (visual) {
            const index = JSON.parse(await readFile(visualIndex, 'utf8'));
            const entries = Object.hasOwn(index, visual[1]) ? index[visual[1]] : undefined;
            if (!entries) throw new Error('Unknown visual project');
            const key = visual[2];
            if (key && !Object.hasOwn(entries, key)) throw new Error('Unknown visual');
            const entry = key ? entries[key] : undefined;
            const body = entry
              ? await readFile(entry.path)
              : JSON.stringify(Object.entries(entries).map(([id, item]) => {
                const { title, caption, width, height } = item as { title: string; caption: string; width: number; height: number };
                return { id, title, caption, width, height };
              }));
            if (entry && createHash('sha256').update(body).digest('hex') !== entry.sha256) {
              throw new Error('Review image changed');
            }
            response.writeHead(200, {
              'Content-Type': entry ? 'image/jpeg' : 'application/json',
              'Content-Length': Buffer.byteLength(body),
              'Cache-Control': 'no-store',
              'X-Content-Type-Options': 'nosniff',
              'Cross-Origin-Resource-Policy': 'same-origin',
            }).end(request.method === 'HEAD' ? undefined : body);
            return;
          }
          const match = /^\/([a-z-]+)(\/file)?$/.exec(request.url ?? '');
          if (!match) throw new Error('Invalid report route');
          const index = JSON.parse(await readFile(reviewIndex, 'utf8'));
          const entry = Object.hasOwn(index, match[1]) ? index[match[1]] : undefined;
          if (!entry || !/\.pdf$/i.test(entry.path)) throw new Error('Unknown report');
          const bytes = await readFile(entry.path);
          if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
            throw new Error('Review source changed');
          }
          const pdf = Boolean(match[2]);
          const body = pdf ? bytes : JSON.stringify({ filename: entry.filename, pages: entry.pages });
          response.writeHead(200, {
            'Content-Type': pdf ? 'application/pdf' : 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'Cross-Origin-Resource-Policy': 'same-origin',
            ...(pdf && { 'Content-Disposition': "inline; filename*=UTF-8''" + encodeURIComponent(entry.filename) }),
          }).end(request.method === 'HEAD' ? undefined : body);
        } catch {
          response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
            .end('本地审核文件不可用，可能缺失或已变更。');
        }
      });
    },
  }],
});
