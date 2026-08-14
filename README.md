# Claude Marketplace

A curated Claude Code marketplace — a single, browsable catalog of agents, slash
commands, skills, and MCP servers, plus a set of independent community plugins
installed directly from their public upstream repos.

- **Live dashboard:** https://claude-code-marketplace-hub.vercel.app
- **Install alias:** `abhi` — add it with
  `/plugin marketplace add PSAbhinav/claude-plugins`

## What's inside

- **Component packs** (`plugins/agents-*`, `commands-*`, `skills-*`, `mcps-*`) —
  per-category packs covering 423 agents, 346 slash commands, 885 skills, and 92
  MCP servers, presented as native plugins.
- **Independent community plugins** — installed straight from their public
  upstreams (Anthropic, Trail of Bits, obra, Microsoft, addyosmani, …). No private
  mirrors: each catalog entry points at the original public repo.
- **Reference material** (`resources/reference/`) — hooks, settings, loops, and
  sandbox templates vendored for browsing only. Plugin hooks/settings execute
  automatically when a plugin is enabled, so third-party hook scripts are **not**
  exposed as installable plugins.

## Install

```
/plugin marketplace add PSAbhinav/claude-plugins
/plugin install skills-development@ccm
```

- MCP packs start **all** servers in the pack when enabled, and most need an API
  key or env config first — for a single server, copy its standalone `.mcp.json`
  snippet from the dashboard instead.
- Enable more plugins per project or per phase with `/plugin`.

## Component packs — provenance

The component packs are vendored from
[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
(MIT, aitmpl.com). Provenance is recorded per-plugin in each pack's
`PROVENANCE.md` and in the marketplace `metadata` — intentionally not surfaced in
plugin names, descriptions, or the dashboard UI.

Refresh from upstream:

```
node scripts/import-aitmpl.mjs --src <extracted claude-code-templates checkout> --commit <sha>
```

This re-vendors every pack, regenerates both marketplace manifests, rebuilds the
dashboard catalog, and re-injects `site/index.html`.

## Web dashboard (`site/`)

`site/index.html` is a self-contained dashboard of the marketplace — every pack,
skill, agent, command, and MCP server, with search, type/category filters, an
install-stack builder, and copyable install commands. It is regenerated from
`site/template.html` by `scripts/import-aitmpl.mjs` (catalog JSON is embedded
inline; `site/catalog.json` is the raw data). Deployed on Vercel — pushing to
`main` redeploys automatically.

## Add a plugin

Edit `.claude-plugin/marketplace.json` and add an entry pointing at the plugin's
public repo:

```json
{
  "name": "my-plugin",
  "source": { "source": "git-subdir", "url": "https://github.com/owner/repo.git", "path": "plugins/my-plugin", "ref": "main" }
}
```

Commit and push, then restart Claude Code (or `/plugin` → refresh).
