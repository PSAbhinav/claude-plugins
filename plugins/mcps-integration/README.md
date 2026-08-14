# mcps-integration

MCP servers — integration (6): alpaca-trading, footballbin-predictions, github, memex, memory, …. NOTE: enabling starts ALL servers in this pack; most need API keys/env config first.

| Server | Description | Env keys |
|---|---|---|
| alpaca-trading | Trading platform MCP server enabling stock, ETF, crypto, and options trading via Alpaca's API. Supports market data, portfolio management, and order execution. | ALPACA_API_KEY, ALPACA_SECRET_KEY |
| footballbin-predictions | AI-powered football match predictions for Premier League and Champions League. Returns half-time scores, full-time scores, next goal scorer, corner counts, and key player analysis. Public endpoint, no API key required. |  |
| github | Direct GitHub API integration for repository management, issue tracking, pull requests, and collaborative development workflows. | GITHUB_PERSONAL_ACCESS_TOKEN |
| memex | Developer context continuity for AI coding agents. Watches your git repos and builds a temporal knowledge graph of modules, symbols, decisions, and open problems via Graphiti + Neo4j, then serves it over MCP. Every edge carries a validity window and a confide… |  |
| memory | Persistent memory and context management for Claude Code sessions. Store and recall information across conversations and projects. |  |
| n8n-mcp | Build and manage n8n workflows directly from Claude. Includes a pre-built database with all n8n node documentation for workflow automation. | MCP_MODE |
