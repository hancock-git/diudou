#!/usr/bin/env node
// Download all assets from http://124.174.43.52 (丢抖AI 电商工作台).
// Videos have TOS-signed URLs (expire in 24h) so run this ASAP.

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

const ASSETS = [
  // Brand logo
  { url: 'http://124.174.43.52/brand/doudou-ai-mark.png', out: 'public/brand/doudou-ai-mark.png' },

  // Favicons / manifest
  { url: 'http://124.174.43.52/favicon.ico', out: 'public/favicon.ico' },
  { url: 'http://124.174.43.52/icon.png', out: 'public/seo/icon.png' },
  { url: 'http://124.174.43.52/apple-icon.png', out: 'public/seo/apple-icon.png' },
  { url: 'http://124.174.43.52/manifest.webmanifest', out: 'public/manifest.webmanifest' },

  // AI-generated images (4)
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/ai-images/2026/07/09/610d935f-c006-4d44-9891-10c32830a9c8.png', out: 'public/images/ai/img-01.png' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/ai-images/2026/07/09/8235f695-f8b8-4659-a173-b887e3a586bb.png', out: 'public/images/ai/img-02.png' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/ai-images/2026/07/09/c23e2b26-f717-4e7d-86c5-6760163b06c0.png', out: 'public/images/ai/img-03.png' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/ai-images/2026/07/09/b3085814-2342-4dda-8fdd-19cc228b5426.png', out: 'public/images/ai/img-04.png' },

  // Video poster frames (permanent URLs)
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/first-frame-inputs/2026/07/10/db4817c6-7aa0-4e43-9588-690dd6607b1c.jpg', out: 'public/images/posters/poster-01.jpg' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/first-frame-inputs/2026/07/09/4deceff8-c256-4d07-8972-92144bd9a7fd.jpg', out: 'public/images/posters/poster-02.jpg' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/first-frame-inputs/2026/07/09/19d797c8-a55f-410f-8a09-fd4b27227482.png', out: 'public/images/posters/poster-03.png' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/first-frame-inputs/2026/07/09/1f05e27a-c0da-43eb-9243-75a8fecc15f5.jpg', out: 'public/images/posters/poster-04.jpg' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/first-frame-inputs/2026/07/08/52b26853-695d-478b-b342-b6c277562e08.png', out: 'public/images/posters/poster-05.png' },
  { url: 'https://cdn.hangfeizk.com/daihuo-jianshou/first-frame-inputs/2026/07/07/3a63fecb-6fa9-4cbf-83e2-e56d73301d9f.png', out: 'public/images/posters/poster-06.png' },

  // Videos (TOS-signed - expire 24h from initial extraction)
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178367228170200000000000000000000ffffac15830b7e759b.mp4', out: 'public/videos/vid-01.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178360727991900000000000000000000ffffac1415cc44e413.mp4', out: 'public/videos/vid-02.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178358748174600000000000000000000ffffac19306cf082a8.mp4', out: 'public/videos/vid-03.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178358725338600000000000000000000ffffac1919e94f8099.mp4', out: 'public/videos/vid-04.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178358673939500000000000000000000ffffac181cf070bfa1.mp4', out: 'public/videos/vid-05.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178349284400800000000000000000000ffffac1813c9314044.mp4', out: 'public/videos/vid-06.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178340164835700000000000000000000ffffac191d201b19e4.mp4', out: 'public/videos/vid-07.mp4' },
  { url: 'https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02178247592829500000000000000000000ffffac18226fe1d272.mp4', out: 'public/videos/vid-08.mp4' },
];

async function download(url, outRelPath) {
  const outPath = path.join(ROOT, outRelPath);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      console.error(`[FAIL ${res.status}] ${outRelPath}`);
      return { ok: false, url, out: outRelPath, status: res.status };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(outPath, buf);
    console.log(`[OK ${(buf.length / 1024).toFixed(1)}KB] ${outRelPath}`);
    return { ok: true, url, out: outRelPath, bytes: buf.length };
  } catch (e) {
    console.error(`[ERR] ${outRelPath}: ${e.message}`);
    return { ok: false, url, out: outRelPath, error: e.message };
  }
}

async function main() {
  console.log(`Downloading ${ASSETS.length} assets to ${ROOT}`);
  const results = [];
  for (let i = 0; i < ASSETS.length; i += 4) {
    const batch = ASSETS.slice(i, i + 4);
    const rs = await Promise.all(batch.map(a => download(a.url, a.out)));
    results.push(...rs);
  }
  const ok = results.filter(r => r.ok).length;
  console.log(`\nDone: ${ok}/${ASSETS.length} succeeded.`);
  if (ok < ASSETS.length) {
    console.log('Failures:');
    results.filter(r => !r.ok).forEach(r => console.log(`  - ${r.out}: ${r.status || r.error}`));
  }
}

main();
