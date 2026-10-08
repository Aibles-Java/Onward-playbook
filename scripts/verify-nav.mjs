#!/usr/bin/env node
// Verifies internal <a href> in the static export (./out) resolve correctly.
// Usage: GITHUB_PAGES=true npm run build && node scripts/verify-nav.mjs
//        npm run build && node scripts/verify-nav.mjs --no-basepath
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const noBase = process.argv.includes('--no-basepath') || process.env.NO_BASEPATH === '1';
const BASE = noBase ? '' : '/Onward-playbook';
const OUT = resolve('out');
if (!existsSync(OUT)) { console.error('out/ not found; run a build first'); process.exit(2); }

function* walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name === 'index.html') yield p;
  }
}

const failures = [];
let pages = 0, checked = 0;
for (const file of walk(OUT)) {
  pages++;
  const page = '/' + file.slice(OUT.length + 1).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<a\s[^>]*?href=(?:"([^"]*)"|'([^']*)')/gi)) {
    const href = (m[1] ?? m[2]).replace(/&amp;/g, '&');
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (href.startsWith(BASE + '/_next/') || href.startsWith('/_next/')) continue;
    checked++;
    const path = href.split(/[?#]/)[0];
    let reason = null;
    if (BASE && !(path === BASE + '/' || path.startsWith(BASE + '/'))) reason = 'missing basePath';
    else {
      const rel = path.slice(BASE.length);
      if (!rel.endsWith('/')) reason = 'missing trailing slash';
      else {
        const target = join(OUT, rel, 'index.html');
        if (!existsSync(target) || !statSync(target).isFile()) reason = 'target not found in out/';
      }
    }
    if (reason) failures.push({ page, href, reason });
  }
}

console.log(`mode: ${noBase ? 'no-basepath' : 'basePath=/Onward-playbook'}`);
console.log(`pages scanned: ${pages}, internal links checked: ${checked}, failures: ${failures.length}`);
for (const f of failures) console.log(`FAIL ${f.page} -> ${f.href}  (${f.reason})`);
process.exit(failures.length ? 1 : 0);
