#!/usr/bin/env node
// Import the aitmpl.com catalog (davila7/claude-code-templates) into this marketplace.
//
// Vendors agents/commands/skills/mcps as per-category plugins under plugins/aitmpl-*,
// vendors hooks/settings/loops/sandbox as reference files under resources/aitmpl/
// (NOT as plugins: plugin hooks auto-execute on enable, so third-party hook scripts
// stay reference-only), updates both marketplace manifests, and rebuilds the
// dashboard catalog (site/catalog.json + site/index.html from site/template.html).
//
// Usage: node scripts/import-aitmpl.mjs --src <extracted-claude-code-templates-repo> [--commit <sha>]
// Re-run against a fresh upstream checkout to refresh the import.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UPSTREAM_REPO = 'https://github.com/davila7/claude-code-templates';
const UPSTREAM_SITE = 'https://www.aitmpl.com/';

const args = process.argv.slice(2);
function argOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}
const SRC = argOf('--src');
const COMMIT = argOf('--commit') || 'unknown';
if (!SRC || !fs.existsSync(path.join(SRC, 'cli-tool', 'components'))) {
  console.error('ERROR: --src must point at an extracted davila7/claude-code-templates checkout');
  process.exit(1);
}
const COMP = path.join(SRC, 'cli-tool', 'components');
const TODAY = argOf('--date') || new Date().toISOString().slice(0, 10);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const read = (f) => fs.readFileSync(f, 'utf8');
const listDirs = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name) : [];
const walk = (d, filter) => {
  const out = [];
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(p, filter));
    else if (!filter || filter(p)) out.push(p);
  }
  return out;
};

// -- lite YAML frontmatter parser (top-level scalar keys only) ---------------
function frontmatter(text) {
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const out = {};
  let key = null, buf = [];
  for (const line of text.slice(3, end).split(/\r?\n/)) {
    // tolerate upstream typos like "+description:" (leading punctuation on keys)
    const m = line.match(/^[+*]?([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      if (key) out[key] = buf.join(' ');
      key = m[1];
      buf = [m[2]];
    } else if (key && line.trim()) {
      buf.push(line.trim());
    }
  }
  if (key) out[key] = buf.join(' ');
  for (const k of Object.keys(out)) {
    let v = out[k].trim().replace(/^[>|][+-]?\s*/, '');
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[k] = v.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return out;
}

// frontmatter name only if it looks like a name; else fall back to file/dir basename
const saneName = (fmName, fallback) =>
  fmName && fmName.length <= 80 && !/[":\\]/.test(fmName) ? fmName : fallback;

const clip = (s, n = 260) => {
  if (!s) return '';
  s = s.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
};

// first paragraph after the first heading — fallback description for commands
function mdDescription(text) {
  const body = text.startsWith('---') ? text.slice(text.indexOf('\n---', 3) + 4) : text;
  const lines = body.split(/\r?\n/);
  let started = false;
  const para = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) { if (para.length) break; continue; }
    if (t.startsWith('#')) { started = true; continue; }
    if (started || para.length || !t.startsWith('#')) para.push(t);
    if (para.length && !t) break;
  }
  return clip(para.join(' '));
}

// Claude Code only discovers skills at skills/<name>/SKILL.md. Upstream categories
// sometimes ARE a single skill (SKILL.md at category root) or nest skills inside
// group dirs (game-development/2d-games/...) — normalize both to direct children.
function normalizeSkillDepth(skillsDir, catSlug) {
  const hasSkillInTree = (d) => walk(d, (p) => path.basename(p) === 'SKILL.md').length > 0;
  if (fs.existsSync(path.join(skillsDir, 'SKILL.md'))) {
    const tmp = skillsDir + '.__wrap';
    fs.renameSync(skillsDir, tmp);
    fs.mkdirSync(skillsDir, { recursive: true });
    fs.renameSync(tmp, path.join(skillsDir, catSlug));
  }
  for (let pass = 0, moved = true; moved && pass < 6; pass++) {
    moved = false;
    for (const child of listDirs(skillsDir)) {
      const childDir = path.join(skillsDir, child);
      if (fs.existsSync(path.join(childDir, 'SKILL.md'))) continue; // proper skill
      if (!hasSkillInTree(childDir)) continue; // plain resource dir — leave alone
      for (const g of listDirs(childDir)) {
        const gDir = path.join(childDir, g);
        if (!hasSkillInTree(gDir)) continue;
        const target = fs.existsSync(path.join(skillsDir, g)) ? `${child}-${g}` : g;
        fs.renameSync(gDir, path.join(skillsDir, target));
        moved = true;
      }
      if (!fs.readdirSync(childDir).length) fs.rmSync(childDir, { recursive: true });
    }
  }
}

function writeJson(f, obj) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(obj, null, 2) + '\n');
}

function pluginProvenance(dir, extraNote = '') {
  fs.writeFileSync(path.join(dir, 'PROVENANCE.md'), [
    '# Provenance',
    '',
    `- Upstream: ${UPSTREAM_REPO} (aitmpl.com)`,
    `- Upstream commit: ${COMMIT}`,
    `- Imported: ${TODAY} via scripts/import-aitmpl.mjs`,
    '- License: MIT (upstream repo). Individual skills may carry their own attribution;',
    '  see resources/reference/ANTHROPIC_ATTRIBUTION.md for Anthropic-derived skills.',
    extraNote,
    '',
  ].filter(Boolean).join('\n'));
}

// Branding: packs present as native marketplace plugins. Upstream provenance
// lives ONLY in PROVENANCE.md + marketplace metadata (MIT attribution kept in-repo,
// never surfaced in names, descriptions, or the dashboard UI).
const AUTHOR = { name: 'Claude Marketplace', url: 'https://github.com/PSAbhinav/claude-plugins' };
const HOMEPAGE = 'https://github.com/PSAbhinav/claude-plugins';

function pluginManifests(dir, name, description, keywords, contentKey, contentVal) {
  // contentKey null → rely on auto-discovery (schema rejects "agents" as a path string)
  const content = contentKey ? { [contentKey]: contentVal } : {};
  writeJson(path.join(dir, '.claude-plugin', 'plugin.json'), {
    $schema: 'https://anthropic.com/claude-code/plugin.schema.json',
    name, version: '1.0.0', description,
    author: AUTHOR, homepage: HOMEPAGE, keywords,
    ...content,
  });
  writeJson(path.join(dir, '.cursor-plugin', 'plugin.json'), {
    name, description, version: '1.0.0',
    author: AUTHOR,
    ...content,
  });
}

// -- clean previous import ----------------------------------------------------
// generated pack names: <type>-<category> (plus legacy aitmpl-* from earlier runs)
const GENERATED = /^(aitmpl-|(agents|commands|skills|mcps)-)/;
const pluginsRoot = path.join(REPO, 'plugins');
for (const d of listDirs(pluginsRoot)) {
  if (GENERATED.test(d)) fs.rmSync(path.join(pluginsRoot, d), { recursive: true, force: true });
}
fs.rmSync(path.join(REPO, 'resources', 'aitmpl'), { recursive: true, force: true });
fs.rmSync(path.join(REPO, 'resources', 'reference'), { recursive: true, force: true });

const newPlugins = []; // marketplace entries
const catalogPlugins = []; // dashboard data for aitmpl plugins
const summary = {};

function marketplaceEntry(name, description, keywords, typeCategory) {
  return {
    name, version: '1.0.0', description,
    author: AUTHOR,
    category: typeCategory,
    source: `./plugins/${name}`,
    keywords,
    tags: ['first-party', 'pack'],
    metadata: {
      ownership: 'vendored-upstream',
      upstreamUrl: `${UPSTREAM_REPO}.git`,
      upstreamSite: UPSTREAM_SITE,
      upstreamCommit: COMMIT,
      importedAt: TODAY,
      updatePolicy: 're-run scripts/import-aitmpl.mjs against a fresh upstream checkout',
    },
  };
}

// -- agents & commands (per-category .md packs) -------------------------------
for (const type of ['agents', 'commands']) {
  const label = type === 'agents' ? 'agents' : 'slash commands';
  summary[type] = 0;
  for (const cat of listDirs(path.join(COMP, type))) {
    const catSlug = slug(cat);
    const name = `${type}-${catSlug}`;
    const srcDir = path.join(COMP, type, cat);
    const destDir = path.join(pluginsRoot, name, type);
    fs.mkdirSync(destDir, { recursive: true });
    fs.cpSync(srcDir, destDir, { recursive: true });

    const files = walk(destDir, (p) => p.endsWith('.md'));
    summary[type] += files.length;
    const items = files.map((f) => {
      const fm = frontmatter(read(f));
      const base = path.basename(f, '.md');
      return {
        name: saneName(fm.name, base),
        description: clip(fm.description) || mdDescription(read(f)),
        ...(type === 'agents' && fm.model ? { model: fm.model } : {}),
        ...(type === 'commands' ? { invoke: `/${base}` } : {}),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const sample = items.slice(0, 5).map(i => i.name).join(', ');
    const description = clip(
      `${label[0].toUpperCase() + label.slice(1)} — ${cat} (${files.length}): ${sample}${files.length > 5 ? ', …' : ''}.`, 300);

    pluginManifests(path.join(pluginsRoot, name), name, description,
      [type, catSlug], type === 'commands' ? 'commands' : null,
      type === 'commands' ? './commands/' : null);
    pluginProvenance(path.join(pluginsRoot, name),
      `- Source path: cli-tool/components/${type}/${cat}/`);
    fs.writeFileSync(path.join(pluginsRoot, name, 'README.md'),
      `# ${name}\n\n${description}\n\n| Name | Description |\n|---|---|\n` +
      items.map(i => `| ${i.name} | ${(i.description || '').replace(/\|/g, '\\|')} |`).join('\n') + '\n');

    newPlugins.push(marketplaceEntry(name, description, [type, catSlug], type));
    catalogPlugins.push({ name, type, category: catSlug, description, items });
  }
}

// -- skills (per-category skill-dir packs) ------------------------------------
summary.skills = 0;
for (const cat of listDirs(path.join(COMP, 'skills'))) {
  const catSlug = slug(cat);
  const name = `skills-${catSlug}`;
  const srcDir = path.join(COMP, 'skills', cat);
  const destDir = path.join(pluginsRoot, name, 'skills');
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  normalizeSkillDepth(destDir, catSlug);

  const skillFiles = listDirs(destDir)
    .filter((d) => fs.existsSync(path.join(destDir, d, 'SKILL.md')))
    .map((d) => path.join(destDir, d, 'SKILL.md'));
  summary.skills += skillFiles.length;
  const items = skillFiles.map((f) => {
    const fm = frontmatter(read(f));
    return {
      name: saneName(fm.name, path.basename(path.dirname(f))),
      description: clip(fm.description),
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const sample = items.slice(0, 5).map(i => i.name).join(', ');
  const big = skillFiles.length > 60 ? ' LARGE pack — enable only when needed.' : '';
  const description = clip(
    `Skills — ${cat} (${skillFiles.length}): ${sample}${skillFiles.length > 5 ? ', …' : ''}.${big}`, 300);

  pluginManifests(path.join(pluginsRoot, name), name, description,
    ['skills', catSlug], 'skills', './skills/');
  pluginProvenance(path.join(pluginsRoot, name),
    `- Source path: cli-tool/components/skills/${cat}/`);
  fs.writeFileSync(path.join(pluginsRoot, name, 'README.md'),
    `# ${name}\n\n${description}\n\n| Skill | Description |\n|---|---|\n` +
    items.map(i => `| ${i.name} | ${(i.description || '').replace(/\|/g, '\\|')} |`).join('\n') + '\n');

  newPlugins.push(marketplaceEntry(name, description, ['skills', catSlug], 'skills'));
  catalogPlugins.push({ name, type: 'skills', category: catSlug, description, items });
}

// -- mcps (per-category merged .mcp.json) -------------------------------------
summary.mcps = 0;
for (const cat of listDirs(path.join(COMP, 'mcps'))) {
  const catSlug = slug(cat);
  const name = `mcps-${catSlug}`;
  const dir = path.join(pluginsRoot, name);
  const merged = {};
  const items = [];
  for (const f of walk(path.join(COMP, 'mcps', cat), (p) => p.endsWith('.json'))) {
    let doc;
    try { doc = JSON.parse(read(f)); } catch { console.warn(`WARN: bad JSON skipped: ${f}`); continue; }
    for (const [server, cfg] of Object.entries(doc.mcpServers || {})) {
      const { description, ...clean } = cfg;
      if (merged[server]) console.warn(`WARN: duplicate MCP server '${server}' in ${cat}; keeping last`);
      merged[server] = clean;
      items.push({
        name: server,
        description: clip(description),
        envKeys: Object.keys(cfg.env || {}),
        config: { mcpServers: { [server]: cfg } },
      });
    }
  }
  items.sort((a, b) => a.name.localeCompare(b.name));
  summary.mcps += items.length;

  fs.mkdirSync(dir, { recursive: true });
  writeJson(path.join(dir, '.mcp.json'), { mcpServers: merged });

  const sample = items.slice(0, 5).map(i => i.name).join(', ');
  const description = clip(
    `MCP servers — ${cat} (${items.length}): ${sample}${items.length > 5 ? ', …' : ''}. NOTE: enabling starts ALL servers in this pack; most need API keys/env config first.`, 300);

  pluginManifests(dir, name, description, ['mcp', catSlug], 'mcpServers', './.mcp.json');
  pluginProvenance(dir, `- Source path: cli-tool/components/mcps/${cat}/`);
  fs.writeFileSync(path.join(dir, 'README.md'),
    `# ${name}\n\n${description}\n\n| Server | Description | Env keys |\n|---|---|---|\n` +
    items.map(i => `| ${i.name} | ${(i.description || '').replace(/\|/g, '\\|')} | ${i.envKeys.join(', ')} |`).join('\n') + '\n');

  newPlugins.push(marketplaceEntry(name, description, ['mcp', catSlug], 'mcp'));
  catalogPlugins.push({ name, type: 'mcps', category: catSlug, description, items });
}

// -- reference-only material: hooks, settings, loops, sandbox -----------------
const references = {};
for (const type of ['hooks', 'settings', 'loops', 'sandbox']) {
  const srcDir = path.join(COMP, type);
  if (!fs.existsSync(srcDir)) continue;
  const destDir = path.join(REPO, 'resources', 'reference', type);
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  references[type] = walk(destDir).map((f) => {
    const rel = path.relative(destDir, f).replace(/\\/g, '/');
    let description = '';
    if (f.endsWith('.md')) description = clip(frontmatter(read(f)).description) || mdDescription(read(f));
    else if (f.endsWith('.json')) {
      try {
        const d = JSON.parse(read(f));
        description = clip(d.description || d.metadata?.description || '');
      } catch { /* leave empty */ }
    }
    return { name: rel, category: rel.split('/')[0], description, path: `resources/reference/${type}/${rel}` };
  });
  summary[type] = references[type].length;
}
const attribution = path.join(COMP, 'skills', 'ANTHROPIC_ATTRIBUTION.md');
if (fs.existsSync(attribution)) {
  fs.copyFileSync(attribution, path.join(REPO, 'resources', 'reference', 'ANTHROPIC_ATTRIBUTION.md'));
}
fs.writeFileSync(path.join(REPO, 'resources', 'reference', 'PROVENANCE.md'), [
  '# Provenance', '',
  `- Upstream: ${UPSTREAM_REPO} (${UPSTREAM_SITE})`,
  `- Upstream commit: ${COMMIT}`,
  `- Imported: ${TODAY} via scripts/import-aitmpl.mjs`,
  '- Reference-only material (hooks, settings, loops, sandbox templates): apply manually.', '',
].join('\n'));

// -- update marketplace manifests ---------------------------------------------
newPlugins.sort((a, b) => a.name.localeCompare(b.name));

const isGenerated = (p) => p.name.startsWith('aitmpl-') ||
  (GENERATED.test(p.name) && p.metadata?.ownership === 'vendored-upstream');

const mpPath = path.join(REPO, '.claude-plugin', 'marketplace.json');
const mp = JSON.parse(read(mpPath));
mp.plugins = mp.plugins.filter((p) => !isGenerated(p)).concat(newPlugins);
writeJson(mpPath, mp);

const cursorPath = path.join(REPO, '.cursor-plugin', 'marketplace.json');
if (fs.existsSync(cursorPath)) {   // optional Cursor mirror — skipped if absent
  const cursor = JSON.parse(read(cursorPath));
  cursor.plugins = cursor.plugins.filter((p) => !GENERATED.test(p.name)).concat(
    newPlugins.map((p) => ({
      name: p.name, description: p.description, version: p.version,
      source: `plugins/${p.name}`, author: p.author,
    })));
  writeJson(cursorPath, cursor);
}

// -- dashboard catalog ----------------------------------------------------------
// Scan ALL vendored plugins (pre-existing + aitmpl) so the dashboard covers the
// entire marketplace, then add upstream-sourced plugins as plugin-level cards.
function scanVendoredPlugin(dir) {
  const out = { skills: [], agents: [], commands: [], mcps: [] };
  const skillsDir = path.join(dir, 'skills');
  for (const d of listDirs(skillsDir)) {
    const f = path.join(skillsDir, d, 'SKILL.md');
    if (!fs.existsSync(f)) continue;
    const fm = frontmatter(read(f));
    out.skills.push({ name: saneName(fm.name, d), description: clip(fm.description) });
  }
  for (const f of walk(path.join(dir, 'agents'), (p) => p.endsWith('.md'))) {
    const fm = frontmatter(read(f));
    out.agents.push({ name: saneName(fm.name, path.basename(f, '.md')), description: clip(fm.description), model: fm.model });
  }
  for (const f of walk(path.join(dir, 'commands'), (p) => p.endsWith('.md'))) {
    const fm = frontmatter(read(f));
    out.commands.push({ name: path.basename(f, '.md'), description: clip(fm.description) || mdDescription(read(f)), invoke: `/${path.basename(f, '.md')}` });
  }
  const mcpFile = path.join(dir, '.mcp.json');
  if (fs.existsSync(mcpFile)) {
    try {
      const doc = JSON.parse(read(mcpFile));
      for (const [server, cfg] of Object.entries(doc.mcpServers || {})) {
        out.mcps.push({ name: server, envKeys: Object.keys(cfg.env || {}), config: { mcpServers: { [server]: cfg } } });
      }
    } catch { /* ignore */ }
  }
  for (const k of Object.keys(out)) out[k].sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

const aitmplByName = Object.fromEntries(catalogPlugins.map((p) => [p.name, p]));
// Dashboard shows ONLY the component packs + independent public upstream plugins.
// First-party vendored plugins (string source that is not a generated pack) are the
// maintainer's own/curated ones — kept installable in the private marketplace but
// hidden from the public dashboard.
const inDashboard = (p) => GENERATED.test(p.name) || (p.source && typeof p.source === 'object');
const catalog = {
  marketplace: mp.name,
  owner: { name: 'Claude Marketplace', url: HOMEPAGE },
  description: mp.metadata?.description,
  generatedAt: TODAY,
  plugins: mp.plugins.filter(inDashboard).map((p) => {
    const vendored = typeof p.source === 'string' && p.source.startsWith('./');
    const base = {
      name: p.name, description: p.description, version: p.version,
      category: p.category || 'first-party', tags: p.tags || [],
      author: p.author?.name, homepage: p.homepage,
      vendored,
      sourceInfo: vendored ? p.source : `${p.source?.url || p.source?.repo || ''}${p.source?.path ? ' → ' + p.source.path : ''}`,
    };
    if (vendored) {
      const comp = scanVendoredPlugin(path.join(REPO, p.source));
      // keep richer aitmpl item data (mcp descriptions) when available
      const rich = aitmplByName[p.name];
      if (rich && rich.type === 'mcps') comp.mcps = rich.items;
      base.components = comp;
    }
    return base;
  }),
  references,
};
writeJson(path.join(REPO, 'site', 'catalog.json'), catalog);

// inject into the dashboard template
const templatePath = path.join(REPO, 'site', 'template.html');
if (fs.existsSync(templatePath)) {
  const json = JSON.stringify(catalog).replace(/<\//g, '<\\/');
  fs.writeFileSync(path.join(REPO, 'site', 'index.html'),
    read(templatePath).replace('__CATALOG_JSON__', json));
  console.log('site/index.html rebuilt from template');
} else {
  console.warn('WARN: site/template.html missing — dashboard not rebuilt');
}

// -- summary --------------------------------------------------------------------
console.log(`\nImported from ${UPSTREAM_REPO} @ ${COMMIT}`);
console.log(`Packs written: ${newPlugins.length} (agents-*/commands-*/skills-*/mcps-*)`);
for (const [k, v] of Object.entries(summary)) console.log(`  ${k}: ${v}`);
console.log(`Marketplace total plugins: ${mp.plugins.length}`);
